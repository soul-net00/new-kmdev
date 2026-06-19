"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  sourceLabel?: string;
  notice?: string;
}

interface ChatResponse {
  reply: string;
  source: string;
  suggestions: string[];
  mode: string;
  sourceLabel: string;
  provider?: string | null;
  notice?: string;
}

type ChatMode = "offline" | "online" | "auto";

const MODES: { value: ChatMode; label: string; desc: string }[] = [
  { value: "offline", label: "Offline", desc: "Instant local" },
  { value: "auto", label: "Auto", desc: "Smart hybrid" },
  { value: "online", label: "Online", desc: "Full AI" },
];

const HOME_OPTIONS = [
  "Learn About Me",
  "View Services",
  "Request a Quote",
  "Start a New Project",
  "Existing Client Support",
  "Ask a Question",
];

const SPRING = { type: "spring" as const, stiffness: 380, damping: 30 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 260, damping: 26 };

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey there — I'm the KMDev assistant. Ask me anything about services, projects, or how to get started.", sourceLabel: "Assistant" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("auto");
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intake, setIntake] = useState({ name: "", email: "", phone: "", company: "" });
  const [intakeBusy, setIntakeBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [kbInset, setKbInset] = useState(0);
  const [vvHeight, setVvHeight] = useState(0);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef("");
  if (!sessionId.current && typeof crypto !== "undefined") {
    sessionId.current = crypto.randomUUID?.() || `s_${Date.now()}`;
  }

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  useEffect(() => { if (isOpen) { scrollToBottom(); inputRef.current?.focus(); } }, [isOpen, scrollToBottom]);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const u = () => setIsMobile(mq.matches);
    u(); mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    const onResize = () => {
      if (vv) { setKbInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop)); setVvHeight(vv.height); }
      else { setKbInset(0); setVvHeight(window.innerHeight); }
    };
    onResize();
    vv?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);
    return () => { vv?.removeEventListener("resize", onResize); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => { if (isOpen && kbInset > 0) scrollToBottom(); }, [kbInset, isOpen, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((p) => [...p, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim(), history: messages, mode, sessionId: sessionId.current }),
      });
      const data: ChatResponse = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.reply || "How can I help?", sourceLabel: data.sourceLabel, notice: data.notice }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Something went wrong. Try again or reach out directly.", sourceLabel: "Error" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { try { recognitionRef.current?.stop(); } catch {} setListening(false); return; }
    const r = new SR();
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    r.onresult = (e: any) => setInput(Array.from(e.results).map((x: any) => x[0].transcript).join(""));
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
    try { r.start(); setListening(true); } catch { setListening(false); }
  };

  // ── TTS voice output ──────────────────────────────────────
  const speakMessage = async (text: string, idx: number) => {
    if (speakingIdx === idx) {
      audioRef.current?.pause();
      audioRef.current = null;
      setSpeakingIdx(null);
      return;
    }
    setSpeakingIdx(idx);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 5000) }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.addEventListener("ended", () => { URL.revokeObjectURL(url); setSpeakingIdx(null); audioRef.current = null; });
      audioRef.current = audio;
      await audio.play();
    } catch {
      setSpeakingIdx(null);
    }
  };

  const submitIntake = async () => {
    if (!intake.name.trim() || !intake.email.trim()) return;
    setIntakeBusy(true);
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: intake, transcript: messages.map((m) => ({ role: m.role, content: m.content })), summary: last?.content || "", estimateText: last?.content || "", sessionId: sessionId.current }),
      });
      if (res.ok) {
        setShowIntake(false); setIntake({ name: "", email: "", phone: "", company: "" });
        setMessages((p) => [...p, { role: "assistant", content: "Request submitted. KMDev will review and get back to you shortly.", sourceLabel: "Submitted" }]);
      }
    } catch {} finally { setIntakeBusy(false); }
  };

  const changeMode = (m: ChatMode) => {
    setMode(m); setShowModeMenu(false);
    const labels: Record<ChatMode, string> = { offline: "Switched to offline — instant local answers.", online: "Online mode — full AI, may take a moment.", auto: "Auto mode — best of both worlds." };
    setMessages((p) => [...p, { role: "assistant", content: labels[m], sourceLabel: m }]);
  };

  const keyboardOpen = isMobile && kbInset > 0;
  const panelHeight = keyboardOpen ? `${Math.max(240, vvHeight - 24)}px` : "min(72dvh, 540px)";

  const wrapperStyle: React.CSSProperties = isMobile
    ? { right: "0.75rem", left: "0.75rem", bottom: keyboardOpen ? `${kbInset + 8}px` : "calc(env(safe-area-inset-bottom,0px) + 5.25rem)" }
    : { right: "1.25rem", bottom: "1.25rem" };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={SPRING}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_8px_32px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 [bottom:calc(env(safe-area-inset-bottom,0px)+5.25rem)] md:[bottom:calc(env(safe-area-inset-bottom,0px)+1.25rem)] md:right-5"
            aria-label="Open chat"
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.95 }}
            transition={SPRING_SOFT}
            className="fixed z-50"
            style={wrapperStyle}
          >
            <div
              className="ml-auto flex w-full max-w-[26rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:w-[26rem]"
              style={{ height: panelHeight }}
            >
              {/* Header */}
              <div className="relative flex items-center justify-between px-5 py-4 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(52 211 153)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">KMDev AI</h3>
                    <p className="text-[11px] text-zinc-500">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 relative z-10">
                  {/* Mode selector */}
                  <div className="relative">
                    <button onClick={() => setShowModeMenu(!showModeMenu)} className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 ring-1 ring-white/5 transition-colors hover:bg-white/10 hover:text-zinc-200">
                      {mode === "auto" ? "Auto" : mode === "online" ? "Online" : "Offline"}
                      <svg className={`h-3 w-3 transition-transform ${showModeMenu ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <AnimatePresence>
                      {showModeMenu && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-zinc-900 ring-1 ring-white/10 p-1 z-50 shadow-xl">
                          {MODES.map((o) => (
                            <button key={o.value} onClick={() => changeMode(o.value)} className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${mode === o.value ? "bg-emerald-500/15 text-emerald-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}>
                              <span className="font-medium">{o.label}</span>
                              <span className="ml-1.5 text-zinc-600">{o.desc}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200" aria-label="Close chat">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 scrollbar-thin">
                <div className="flex flex-col gap-3 py-2">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING_SOFT, delay: i === messages.length - 1 ? 0.05 : 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[82%]">
                        {msg.notice && msg.role === "assistant" && (
                          <div className="mb-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 text-[10px] text-amber-400/80">{msg.notice}</div>
                        )}
                        <div className={`rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-emerald-500 text-white rounded-br-lg" : "bg-zinc-800/80 text-zinc-200 rounded-bl-lg ring-1 ring-white/5"}`}>
                          <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        {msg.sourceLabel && msg.role === "assistant" && (
                          <div className="mt-1 px-1 flex items-center gap-2">
                            <p className="text-[10px] text-zinc-600">{msg.sourceLabel}</p>
                            <button
                              onClick={() => speakMessage(msg.content, i)}
                              aria-label={speakingIdx === i ? "Stop speaking" : "Read aloud"}
                              className={`p-0.5 rounded transition-colors ${speakingIdx === i ? "text-blue-400 animate-pulse" : "text-zinc-500 hover:text-zinc-300"}`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {speakingIdx === i
                                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  : <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
                                }
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl bg-zinc-800/80 px-4 py-3 ring-1 ring-white/5">
                        {[0, 1, 2].map((d) => (
                          <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick options */}
              {messages.length <= 2 && !isLoading && !keyboardOpen && (
                <div className="px-4 pb-3 flex-shrink-0">
                  <div className="grid grid-cols-2 gap-1.5">
                    {HOME_OPTIONS.map((opt) => (
                      <button key={opt} onClick={() => sendMessage(opt)} className="cursor-pointer rounded-xl bg-white/[0.03] px-3 py-2 text-left text-[11px] font-medium text-zinc-400 ring-1 ring-white/5 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-300 hover:ring-emerald-500/20 active:scale-[0.97]">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Intake form */}
              {showIntake && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-zinc-900/50 p-4 flex-shrink-0">
                  <p className="mb-2.5 text-[11px] font-medium text-zinc-400">Submit for developer review</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["name", "email", "phone", "company"] as const).map((f) => (
                      <input key={f} value={intake[f]} onChange={(e) => setIntake({ ...intake, [f]: e.target.value })} placeholder={f === "name" ? "Name *" : f === "email" ? "Email *" : f === "phone" ? "Phone" : "Company"} className="rounded-lg border-0 bg-white/5 px-3 py-2 text-xs text-zinc-200 ring-1 ring-white/5 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={submitIntake} disabled={intakeBusy} className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-50 active:scale-[0.97]">{intakeBusy ? "Sending..." : "Submit"}</button>
                    <button onClick={() => setShowIntake(false)} className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 ring-1 ring-white/5 hover:bg-white/5">Cancel</button>
                  </div>
                </motion.div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-white/5 p-3 flex-shrink-0 bg-zinc-950">
                {!showIntake && !keyboardOpen && (
                  <button type="button" onClick={() => setShowIntake(true)} className="mb-2.5 w-full cursor-pointer rounded-lg bg-emerald-500/8 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/15 transition-colors hover:bg-emerald-500/15 active:scale-[0.98]">
                    Submit project request for review
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={toggleVoice} aria-label="Voice input" className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${listening ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-white/5 text-zinc-500 ring-1 ring-white/5 hover:bg-white/10 hover:text-zinc-300"}`}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                  </button>
                  <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }} placeholder={listening ? "Listening..." : "Ask anything..."} disabled={isLoading} className="flex-1 rounded-xl border-0 bg-white/5 px-4 py-2.5 text-[13px] text-zinc-200 ring-1 ring-white/5 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50" />
                  <motion.button type="submit" disabled={!input.trim() || isLoading} whileTap={{ scale: 0.9 }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all duration-200 hover:bg-emerald-400 disabled:opacity-30 disabled:shadow-none">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
