import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Skill } from "@/models/Skill";
import { SiteSettings } from "@/models/SiteSettings";
import { LearnedQA } from "@/models/LearnedQA";
import { offlineKnowledge, matchCategory, getOfflineResponse } from "@/lib/chat/offlineKnowledge";
import { findLearnedMatch, saveLearnedAnswer, normalizeQuestion } from "@/lib/chat/matcher";
import { buildSystemPrompt, UNRELATED_FALLBACK, ERROR_FALLBACK, EMPTY_INPUT_RESPONSE } from "@/lib/chat/systemPrompt";

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 20;
const CACHE_TTL = 10 * 60 * 1000;
const OPENROUTER_TIMEOUT = 6000;

type ChatMode = "offline" | "online" | "auto";
type ResponseSource = "offline" | "learned" | "openrouter" | "fallback";

interface CacheEntry {
  data: ResponseData;
  timestamp: number;
}

interface ResponseData {
  reply: string;
  source: ResponseSource;
  suggestions: string[];
  mode: ChatMode;
  sourceLabel: string;
}

const responseCache = new Map<string, CacheEntry>();
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    const newRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    requestCounts.set(ip, newRecord);
    return newRecord;
  }
  
  record.count++;
  return record;
}

function isRateLimited(ip: string) {
  return getRateLimitInfo(ip).count > MAX_REQUESTS;
}

function getCachedResponse(key: string): ResponseData | null {
  const entry = responseCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  if (entry) {
    responseCache.delete(key);
  }
  return null;
}

function setCachedResponse(key: string, data: ResponseData) {
  if (responseCache.size > 200) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { data, timestamp: Date.now() });
}

function getDefaultMode(): ChatMode {
  return "auto";
}

function getSourceLabel(source: ResponseSource): string {
  switch (source) {
    case "offline": return "📴 Quick Reply";
    case "learned": return "🧠 Learned";
    case "openrouter": return "🤖 AI Powered";
    case "fallback": return "🔄 Fallback";
    default: return "";
  }
}

function getOfflineFallbackNotice(): string {
  return "\n\n_📡 Offline mode - Some questions may need Online or Auto mode for full answers._";
}

async function getPortfolioContext(): Promise<string> {
  try {
    await connectToDatabase();
    
    const [settings, projects, services, skills] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Service.find({ active: true }).limit(5).lean(),
      Skill.find({}).limit(10).lean()
    ]);

    const parts: string[] = [];

    if (settings) {
      if (settings.brandName) parts.push(`Brand: ${settings.brandName}`);
      if (settings.contact?.email) parts.push(`Email: ${settings.contact.email}`);
      if (settings.contact?.whatsapp) parts.push(`WhatsApp: ${settings.contact.whatsapp}`);
    }

    if (projects && projects.length > 0) {
      parts.push(`Projects: ${projects.map((p: any) => p.title).join(", ")}`);
    }

    if (services && services.length > 0) {
      parts.push(`Services: ${services.map((s: any) => s.name).join(", ")}`);
    }

    if (skills && skills.length > 0) {
      parts.push(`Skills: ${skills.map((s: any) => s.name).join(", ")}`);
    }

    return parts.join(" | ");
  } catch {
    return "";
  }
}

async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  model: string
): Promise<{ response: string | null; timedOut: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 400,
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("CHAT: OpenRouter error:", response.status);
      return { response: null, timedOut: false };
    }

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      return { response: data.choices[0].message.content, timedOut: false };
    }

    return { response: null, timedOut: false };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === "AbortError") {
      console.log("CHAT: OpenRouter timed out after", OPENROUTER_TIMEOUT, "ms");
      return { response: null, timedOut: true };
    }
    
    console.error("CHAT: OpenRouter fetch failed:", error);
    return { response: null, timedOut: false };
  }
}

function createResponse(
  reply: string,
  source: ResponseSource,
  suggestions: string[],
  mode: ChatMode
): ResponseData {
  return {
    reply,
    source,
    suggestions,
    mode,
    sourceLabel: getSourceLabel(source)
  };
}

async function processOfflineMode(userMessage: string): Promise<ResponseData> {
  const category = matchCategory(userMessage);
  const offline = getOfflineResponse(category);
  
  return createResponse(
    offline.response + getOfflineFallbackNotice(),
    "offline",
    offline.suggestions,
    "offline"
  );
}

async function processOnlineMode(
  userMessage: string,
  history: any[],
  apiKey: string,
  model: string
): Promise<ResponseData> {
  const portfolioContext = await getPortfolioContext();
  const systemPrompt = buildSystemPrompt(portfolioContext);

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt }
  ];

  if (history && Array.isArray(history)) {
    history.slice(-4).forEach((msg: any) => {
      if (msg.role && msg.content && typeof msg.content === "string") {
        messages.push({ role: msg.role, content: msg.content });
      }
    });
  }

  messages.push({ role: "user", content: userMessage });

  const { response: aiResponse, timedOut } = await callOpenRouter(messages, apiKey, model);
  
  if (aiResponse) {
    await saveLearnedAnswer(userMessage, aiResponse, "openrouter");
    
    return createResponse(
      aiResponse,
      "openrouter",
      ["What services do you offer?", "Show me projects", "How can I contact you?"],
      "online"
    );
  }

  if (timedOut) {
    const category = matchCategory(userMessage);
    const offline = getOfflineResponse(category);
    
    return createResponse(
      "⏱️ AI is taking longer than expected. Here's a quick answer while you wait: " + offline.response,
      "fallback",
      offline.suggestions,
      "online"
    );
  }

  const category = matchCategory(userMessage);
  const offline = getOfflineResponse(category);
  
  return createResponse(
    offline.response + getOfflineFallbackNotice(),
    "fallback",
    offline.suggestions,
    "online"
  );
}

async function processAutoMode(
  userMessage: string,
  history: any[],
  apiKey: string,
  model: string
): Promise<ResponseData> {
  const learnedMatch = await findLearnedMatch(userMessage);
  if (learnedMatch) {
    return createResponse(
      learnedMatch.answer,
      "learned",
      ["What else can you tell me?", "Show me your projects", "How can I contact you?"],
      "auto"
    );
  }

  const category = matchCategory(userMessage);
  const isSimple = offlineKnowledge[category]?.keywords?.length > 0 && 
                   category !== "random_unrelated" && 
                   category !== "unknown_default";
  
  if (isSimple) {
    const offline = getOfflineResponse(category);
    return createResponse(
      offline.response,
      "offline",
      offline.suggestions,
      "auto"
    );
  }

  if (apiKey) {
    const portfolioContext = await getPortfolioContext();
    const systemPrompt = buildSystemPrompt(portfolioContext);

    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt }
    ];

    if (history && Array.isArray(history)) {
      history.slice(-4).forEach((msg: any) => {
        if (msg.role && msg.content && typeof msg.content === "string") {
          messages.push({ role: msg.role, content: msg.content });
        }
      });
    }

    messages.push({ role: "user", content: userMessage });

    const { response: aiResponse, timedOut } = await callOpenRouter(messages, apiKey, model);
    
    if (aiResponse) {
      await saveLearnedAnswer(userMessage, aiResponse, "openrouter");
      
      return createResponse(
        aiResponse,
        "openrouter",
        ["What services do you offer?", "Show me projects", "How can I contact you?"],
        "auto"
      );
    }

    if (timedOut) {
      const category = matchCategory(userMessage);
      const offline = getOfflineResponse(category);
      
      return createResponse(
        "⏱️ AI thinking... Here's a quick answer: " + offline.response,
        "fallback",
        offline.suggestions,
        "auto"
      );
    }
  }

  if (category === "random_unrelated") {
    const offline = getOfflineResponse(category);
    return createResponse(
      UNRELATED_FALLBACK,
      "fallback",
      offline.suggestions,
      "auto"
    );
  }

  const offline = getOfflineResponse(category);
  return createResponse(
    offline.response,
    "fallback",
    offline.suggestions,
    "auto"
  );
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  try {
    if (isRateLimited(ip)) {
      return NextResponse.json(createResponse(
        "Too many requests. Please wait a moment.",
        "fallback",
        ["What services do you offer?", "Show me your projects", "How can I contact you?"],
        getDefaultMode()
      ), { status: 429 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(createResponse(
        "Invalid request format.",
        "fallback",
        ["What services do you offer?", "Show me your projects", "How can I contact you?"],
        getDefaultMode()
      ), { status: 400 });
    }

    const { message, history, mode: requestedMode } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(createResponse(
        EMPTY_INPUT_RESPONSE,
        "fallback",
        ["What services do you offer?", "Show me your projects", "How can I contact you?"],
        getDefaultMode()
      ), { status: 200 });
    }

    const userMessage = message.trim();

    if (userMessage.length > 2000) {
      return NextResponse.json(createResponse(
        "Message is too long. Please keep it under 2000 characters.",
        "fallback",
        ["Try a shorter message", "Contact KMDev directly", "Visit the contact page"],
        getDefaultMode()
      ), { status: 400 });
    }

    console.log("CHAT:", ip, "-", userMessage.substring(0, 50));

    const mode = (requestedMode as ChatMode) || getDefaultMode();
    const cacheKey = `${mode}_${normalizeQuestion(userMessage)}`;
    const cached = getCachedResponse(cacheKey);
    if (cached && cached.mode === mode) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct-v0.1";

    let response: ResponseData;

    switch (mode) {
      case "offline":
        response = await processOfflineMode(userMessage);
        break;
      
      case "online":
        if (apiKey) {
          response = await processOnlineMode(userMessage, history, apiKey, model);
        } else {
          response = await processOfflineMode(userMessage);
        }
        break;
      
      case "auto":
      default:
        if (apiKey) {
          response = await processAutoMode(userMessage, history, apiKey, model);
        } else {
          response = await processOfflineMode(userMessage);
        }
        break;
    }

    setCachedResponse(cacheKey, response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("CHAT ERROR:", error);
    
    return NextResponse.json(createResponse(
      ERROR_FALLBACK,
      "fallback",
      ["What services do you offer?", "Show me your projects", "How can I contact you?"],
      getDefaultMode()
    ));
  }
}