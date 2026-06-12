/**
 * Dual-AI engine: Gemini (primary) with automatic Grok (xAI) failover.
 *
 * All calls run server-side only. API keys are read from environment
 * variables and never returned to the client.
 */

export type AiProvider = "gemini" | "grok";

export interface AiTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AiResult {
  text: string | null;
  provider: AiProvider | null;
  /** true when the primary (Gemini) failed and Grok answered instead */
  switched: boolean;
  /** user-facing notice when a failover occurred */
  notice?: string;
}

const TIMEOUT_MS = 9000;
const MAX_TOKENS = 700;
const TEMPERATURE = 0.7;

function geminiEnabled() {
  return process.env.AI_GEMINI_ENABLED !== "false" && Boolean(process.env.GEMINI_API_KEY);
}
function grokEnabled() {
  return process.env.AI_GROK_ENABLED !== "false" && Boolean(process.env.GROK_API_KEY);
}

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(id);
  }
}

// ── Gemini ──────────────────────────────────────────────────
async function callGemini(system: string, turns: AiTurn[]): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const contents = turns.map((t) => ({
    role: t.role === "assistant" ? "model" : "user",
    parts: [{ text: t.content }]
  }));

  const res = await withTimeout((signal) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: TEMPERATURE }
      }),
      signal
    })
  );

  if (!res.ok) {
    console.error("AI: Gemini error", res.status);
    return null;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("").trim();
  return text || null;
}

// ── Grok (xAI, OpenAI-compatible) ───────────────────────────
async function callGrok(system: string, turns: AiTurn[]): Promise<string | null> {
  const key = process.env.GROK_API_KEY!;
  const model = process.env.GROK_MODEL || "grok-2-latest";

  const messages = [
    { role: "system", content: system },
    ...turns.map((t) => ({ role: t.role === "assistant" ? "assistant" : "user", content: t.content }))
  ];

  const res = await withTimeout((signal) =>
    fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages, max_tokens: MAX_TOKENS, temperature: TEMPERATURE }),
      signal
    })
  );

  if (!res.ok) {
    console.error("AI: Grok error", res.status);
    return null;
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text || null;
}

/**
 * Ask the dual-AI engine. Tries Gemini first; on any failure (error, timeout,
 * rate limit, disabled) automatically falls back to Grok. History is passed
 * through unchanged so the conversation is never lost across a switch.
 *
 * `overrides` lets admin DB settings enable/disable each provider at runtime.
 */
export async function askAI(
  system: string,
  turns: AiTurn[],
  overrides?: { gemini?: boolean; grok?: boolean }
): Promise<AiResult> {
  const canGemini = (overrides?.gemini ?? true) && geminiEnabled();
  const canGrok = (overrides?.grok ?? true) && grokEnabled();

  if (canGemini) {
    try {
      const text = await callGemini(system, turns);
      if (text) return { text, provider: "gemini", switched: false };
    } catch (e: any) {
      console.error("AI: Gemini failed", e?.name || e);
    }
  }

  if (canGrok) {
    try {
      const text = await callGrok(system, turns);
      if (text) {
        return {
          text,
          provider: "grok",
          switched: canGemini, // switched only if Gemini was the intended primary
          notice: canGemini ? "Gemini is currently unavailable. Grok is assisting you." : undefined
        };
      }
    } catch (e: any) {
      console.error("AI: Grok failed", e?.name || e);
    }
  }

  return { text: null, provider: null, switched: false };
}
