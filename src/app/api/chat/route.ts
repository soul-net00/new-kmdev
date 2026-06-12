import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Skill } from "@/models/Skill";
import { SiteSettings } from "@/models/SiteSettings";
import { ChatConversation } from "@/models/ChatConversation";
import { offlineKnowledge, matchCategory, getOfflineResponse } from "@/lib/chat/offlineKnowledge";
import { findLearnedMatch, saveLearnedAnswer, normalizeQuestion } from "@/lib/chat/matcher";
import { buildSystemPrompt, UNRELATED_FALLBACK, ERROR_FALLBACK, EMPTY_INPUT_RESPONSE } from "@/lib/chat/systemPrompt";
import { askAI, type AiTurn, type AiProvider } from "@/lib/ai/providers";
import { getAgencySettings } from "@/lib/agency";

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 20;
const CACHE_TTL = 10 * 60 * 1000;

type ChatMode = "offline" | "online" | "auto";
type ResponseSource = "offline" | "learned" | "gemini" | "grok" | "fallback";

interface ResponseData {
  reply: string;
  source: ResponseSource;
  suggestions: string[];
  mode: ChatMode;
  sourceLabel: string;
  provider: AiProvider | null;
  notice?: string;
}

interface CacheEntry {
  data: ResponseData;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  record.count++;
  return record.count > MAX_REQUESTS;
}

function getCachedResponse(key: string): ResponseData | null {
  const entry = responseCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  if (entry) responseCache.delete(key);
  return null;
}

function setCachedResponse(key: string, data: ResponseData) {
  if (responseCache.size > 200) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { data, timestamp: Date.now() });
}

function getSourceLabel(source: ResponseSource): string {
  switch (source) {
    case "offline": return "📴 Quick Reply";
    case "learned": return "🧠 Learned";
    case "gemini": return "✨ Gemini";
    case "grok": return "⚡ Grok";
    case "fallback": return "🔄 Fallback";
    default: return "";
  }
}

function createResponse(
  reply: string,
  source: ResponseSource,
  suggestions: string[],
  mode: ChatMode,
  provider: AiProvider | null = null,
  notice?: string
): ResponseData {
  return { reply, source, suggestions, mode, sourceLabel: getSourceLabel(source), provider, notice };
}

const DEFAULT_SUGGESTIONS = ["Start a New Project", "View Services", "Request a Quote"];

async function getPortfolioContext(): Promise<string> {
  try {
    await connectToDatabase();
    const [settings, projects, services, skills] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      Service.find({ active: true }).limit(8).lean(),
      Skill.find({}).limit(12).lean()
    ]);

    const parts: string[] = [];
    if (settings) {
      if (settings.brandName) parts.push(`Brand: ${settings.brandName}`);
      if (settings.contact?.email) parts.push(`Email: ${settings.contact.email}`);
      if (settings.contact?.whatsapp) parts.push(`WhatsApp: ${settings.contact.whatsapp}`);
    }
    if (projects?.length) parts.push(`Projects: ${projects.map((p: any) => p.title).join(", ")}`);
    if (services?.length) {
      parts.push(`Services: ${services.map((s: any) => `${s.name} (from R${s.priceFrom})`).join(", ")}`);
    }
    if (skills?.length) parts.push(`Skills: ${skills.map((s: any) => s.name).join(", ")}`);
    return parts.join(" | ");
  } catch {
    return "";
  }
}

function buildTurns(history: any[], userMessage: string): AiTurn[] {
  const turns: AiTurn[] = [];
  if (Array.isArray(history)) {
    history.slice(-8).forEach((msg: any) => {
      if ((msg.role === "user" || msg.role === "assistant") && typeof msg.content === "string" && msg.content.trim()) {
        turns.push({ role: msg.role, content: msg.content });
      }
    });
  }
  turns.push({ role: "user", content: userMessage });
  return turns;
}

async function runAi(userMessage: string, history: any[]): Promise<ResponseData | null> {
  const [portfolioContext, settings] = await Promise.all([
    getPortfolioContext(),
    getAgencySettings().catch(() => null as any)
  ]);
  const system = buildSystemPrompt(portfolioContext, settings?.aiPromptExtra);
  const turns = buildTurns(history, userMessage);

  const result = await askAI(system, turns, {
    gemini: settings ? settings.aiGeminiEnabled !== false : true,
    grok: settings ? settings.aiGrokEnabled !== false : true
  });
  if (!result.text || !result.provider) return null;

  // Learn single-turn answers only (multi-turn intake answers are contextual).
  if (turns.length <= 1) {
    saveLearnedAnswer(userMessage, result.text).catch(() => {});
  }

  return createResponse(
    result.text,
    result.provider,
    DEFAULT_SUGGESTIONS,
    "auto",
    result.provider,
    result.notice
  );
}

async function processOffline(userMessage: string): Promise<ResponseData> {
  const category = matchCategory(userMessage);
  const offline = getOfflineResponse(category);
  return createResponse(offline.response, "offline", offline.suggestions, "offline");
}

async function persistConversation(sessionId: string, userMessage: string, response: ResponseData) {
  if (!sessionId) return;
  try {
    await connectToDatabase();
    await ChatConversation.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: userMessage, createdAt: new Date() },
              { role: "assistant", content: response.reply, provider: response.provider || response.source, createdAt: new Date() }
            ]
          }
        }
      },
      { upsert: true }
    );
  } catch (e) {
    console.error("CHAT: persist failed", e);
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    if (isRateLimited(ip)) {
      return NextResponse.json(
        createResponse("Too many requests. Please wait a moment.", "fallback", DEFAULT_SUGGESTIONS, "auto"),
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(createResponse("Invalid request format.", "fallback", DEFAULT_SUGGESTIONS, "auto"), { status: 400 });
    }

    const { message, history, mode: requestedMode, sessionId } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(createResponse(EMPTY_INPUT_RESPONSE, "fallback", DEFAULT_SUGGESTIONS, "auto"));
    }

    const userMessage = message.trim();
    if (userMessage.length > 2000) {
      return NextResponse.json(
        createResponse("Message is too long. Please keep it under 2000 characters.", "fallback", DEFAULT_SUGGESTIONS, "auto"),
        { status: 400 }
      );
    }

    const mode: ChatMode = (requestedMode as ChatMode) || "auto";
    const hasHistory = Array.isArray(history) && history.length > 0;

    // Offline mode: deterministic local answers only.
    if (mode === "offline") {
      const response = await processOffline(userMessage);
      persistConversation(sessionId, userMessage, response);
      return NextResponse.json(response);
    }

    // Cache only single-turn, non-AI lookups (multi-turn intake is contextual).
    const cacheKey = `${mode}_${normalizeQuestion(userMessage)}`;
    if (!hasHistory) {
      const cached = getCachedResponse(cacheKey);
      if (cached) return NextResponse.json(cached);
    }

    // Auto mode: prefer a learned answer for simple, single-turn questions.
    if (mode === "auto" && !hasHistory) {
      const learned = await findLearnedMatch(userMessage);
      if (learned) {
        const response = createResponse(learned.answer, "learned", DEFAULT_SUGGESTIONS, "auto");
        setCachedResponse(cacheKey, response);
        persistConversation(sessionId, userMessage, response);
        return NextResponse.json(response);
      }
    }

    // Online / Auto: dual-AI (Gemini primary, Grok failover).
    let response = await runAi(userMessage, history);

    // Both providers unavailable → graceful offline fallback.
    if (!response) {
      const category = matchCategory(userMessage);
      const offline = getOfflineResponse(category);
      const text = category === "random_unrelated" ? UNRELATED_FALLBACK : offline.response;
      response = createResponse(text, "fallback", offline.suggestions, mode);
    }

    if (!hasHistory && (response.source === "gemini" || response.source === "grok")) {
      setCachedResponse(cacheKey, response);
    }
    persistConversation(sessionId, userMessage, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json(createResponse(ERROR_FALLBACK, "fallback", DEFAULT_SUGGESTIONS, "auto"));
  }
}
