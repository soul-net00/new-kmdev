"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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

interface ModeOption {
  value: ChatMode;
  label: string;
  icon: string;
  description: string;
}

const MODES: ModeOption[] = [
  { value: "offline", label: "Offline", icon: "📴", description: "Instant local answers" },
  { value: "auto", label: "Auto", icon: "🧠", description: "Smart & fast" },
  { value: "online", label: "Online", icon: "🤖", description: "Full AI power" }
];

const HOME_OPTIONS = [
  "Learn About Me",
  "View Services",
  "Request a Quote",
  "Start a New Project",
  "Existing Client Support",
  "Ask a Question"
];

const QUICK_SUGGESTIONS = [
  "Who is Kgomotso?",
  "What services do you offer?",
  "Show me projects",
  "How can I contact you?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome 👋 I'm the KMDev project assistant. I can help you learn about KMDev, explore services, request a quote, start a new project, or get client support. How can I help you today?",
      sourceLabel: "✨ Assistant"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [mode, setMode] = useState<ChatMode>("auto");
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intake, setIntake] = useState({ name: "", email: "", phone: "", company: "" });
  const [intakeBusy, setIntakeBusy] = useState(false);
  const [listening, setListening] = useState(false);
  // ── Mobile keyboard / viewport handling ──────────────────
  const [kbInset, setKbInset] = useState(0); // px the soft keyboard overlaps the viewport
  const [vvHeight, setVvHeight] = useState(0); // current visible (visual) viewport height
  const [isMobile, setIsMobile] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef<string>("");
  if (!sessionId.current && typeof crypto !== "undefined") {
    sessionId.current = crypto.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Track whether we're on a mobile-sized screen
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track the visual viewport so the panel stays above the on-screen keyboard
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    const onResize = () => {
      if (vv) {
        // How many px the keyboard (or browser UI) overlaps the layout viewport bottom
        const overlap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        setKbInset(overlap);
        setVvHeight(vv.height);
      } else {
        setKbInset(0);
        setVvHeight(window.innerHeight);
      }
    };
    onResize();
    vv?.addEventListener("resize", onResize);
    vv?.addEventListener("scroll", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      vv?.removeEventListener("resize", onResize);
      vv?.removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // When the keyboard opens, keep the latest message / input in view
  useEffect(() => {
    if (isOpen && kbInset > 0) scrollToBottom();
  }, [kbInset, isOpen, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history: messages,
          mode: mode,
          sessionId: sessionId.current
        })
      });

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "I'm here to help! What would you like to know about KMDev?",
        sourceLabel: data.sourceLabel || "🧠 Auto",
        notice: data.notice
      };
      setMessages(prev => [...prev, assistantMessage]);
      setShowSuggestions(true);
    } catch {
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble responding right now. Please try again or contact KMDev directly.",
        sourceLabel: "⚠️ Error"
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowSuggestions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Voice input (Web Speech API) ─────────────────────────
  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    // The Web Speech API only works in a secure context (HTTPS) or on localhost.
    if (!window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      alert("Voice input needs a secure connection (HTTPS). It works on localhost and on your live HTTPS site, but not over plain HTTP.");
      return;
    }
    if (listening) {
      try { recognitionRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (event: any) => {
      setListening(false);
      const err = event?.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        alert("Microphone access was blocked. Allow the mic for this site in your browser's address-bar permissions, then try again.");
      } else if (err === "no-speech") {
        alert("I didn't catch any speech. Tap the mic and speak clearly.");
      } else if (err === "audio-capture") {
        alert("No microphone was found. Check that a mic is connected and enabled.");
      } else if (err === "network") {
        alert("Voice recognition needs an internet connection and could not reach the speech service.");
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if a session is already active — reset state.
      setListening(false);
    }
  };

  // ── Submit a quote / project request to the admin dashboard ──
  const submitIntake = async () => {
    if (!intake.name.trim() || !intake.email.trim()) {
      alert("Please enter your name and email so KMDev can reach you.");
      return;
    }
    setIntakeBusy(true);
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: intake,
          transcript: messages.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({ role: m.role, content: m.content })),
          summary: lastAssistant?.content || "",
          estimateText: lastAssistant?.content || "",
          sessionId: sessionId.current
        })
      });
      if (res.ok) {
        setShowIntake(false);
        setIntake({ name: "", email: "", phone: "", company: "" });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "✅ Your request has been submitted for developer review. KMDev will review the details and get back to you by email or WhatsApp. Reference will be issued once approved.",
            sourceLabel: "📋 Submitted"
          }
        ]);
      } else {
        alert("Could not submit. Please check your details and try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIntakeBusy(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const changeMode = (newMode: ChatMode) => {
    setMode(newMode);
    setShowModeMenu(false);
    
    let notice = "";
    
    if (newMode === "offline") {
      notice = "📴 Offline mode! Responses are fast but may not answer all questions. Online mode might be slow, but we're working on that!";
    } else if (newMode === "online") {
      notice = "🤖 Online mode! Full AI power - responses may take a few seconds.";
    } else if (mode === "offline" && newMode === "auto") {
      notice = "🧠 Auto mode! Smart hybrid - uses offline first, then AI for complex questions.";
    } else {
      notice = "🧠 Back to Auto mode!";
    }

    const noticeMessage: Message = {
      role: "assistant",
      content: notice,
      sourceLabel: newMode === "offline" ? "📴" : newMode === "online" ? "🤖" : "🧠"
    };
    setMessages(prev => [...prev, noticeMessage]);
  };

  const getModeLabel = () => {
    const currentMode = MODES.find(m => m.value === mode);
    return currentMode ? `${currentMode.icon} ${currentMode.label}` : "🧠 Auto";
  };

  // ── Responsive position + size (keeps panel above the keyboard on mobile) ──
  const keyboardOpen = isMobile && kbInset > 0;

  const wrapperStyle: React.CSSProperties = isMobile
    ? {
        right: "0.75rem",
        left: "0.75rem",
        bottom: keyboardOpen
          ? `${kbInset + 8}px`
          : "calc(env(safe-area-inset-bottom, 0px) + 5.25rem)",
      }
    : {
        right: "1rem",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
      };

  // Cap the panel to the visible area when the keyboard is up; otherwise use a comfortable default
  const panelHeight = keyboardOpen
    ? `${Math.max(240, vvHeight - 24)}px`
    : "min(70dvh, 500px)";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 [bottom:calc(env(safe-area-inset-bottom,0px)+5.25rem)] md:[bottom:calc(env(safe-area-inset-bottom,0px)+1rem)] md:right-4 ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      <div
        className={`fixed z-50 transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        style={wrapperStyle}
      >
        <div 
          className="ml-auto flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:w-[28rem]"
          style={{ height: panelHeight }}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">KMDev AI</h3>
                <p className="text-xs text-blue-100">Ask me about KMDev</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowModeMenu(!showModeMenu)}
                  className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30 transition-colors"
                >
                  <span>{getModeLabel()}</span>
                  <svg className={`h-3 w-3 transition-transform ${showModeMenu ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showModeMenu && (
                  <div className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {MODES.map((modeOption) => (
                      <button
                        key={modeOption.value}
                        onClick={() => changeMode(modeOption.value)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                          mode === modeOption.value ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>{modeOption.icon}</span>
                        <div>
                          <div className="font-medium">{modeOption.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{modeOption.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="flex flex-col gap-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%]">
                      {msg.notice && msg.role === "assistant" && (
                        <div className="mb-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                          ⚡ {msg.notice}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
                        }`}
                      >
                        <p 
                          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                        >
                          {msg.content}
                        </p>
                      </div>
                      {msg.sourceLabel && msg.role === "assistant" && (
                        <div className="mt-1 px-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {msg.sourceLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {showSuggestions && messages.length <= 2 && !isLoading && !keyboardOpen && (
              <div className="px-4 py-3 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">How can I help?</p>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {HOME_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => sendMessage(option)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Or ask a quick question:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showIntake && (
            <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-300">Submit your project request for developer review</p>
              <div className="grid grid-cols-2 gap-2">
                <input value={intake.name} onChange={(e) => setIntake({ ...intake, name: e.target.value })} placeholder="Full name *" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                <input value={intake.email} onChange={(e) => setIntake({ ...intake, email: e.target.value })} placeholder="Email *" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                <input value={intake.phone} onChange={(e) => setIntake({ ...intake, phone: e.target.value })} placeholder="Phone" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                <input value={intake.company} onChange={(e) => setIntake({ ...intake, company: e.target.value })} placeholder="Company (optional)" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
              </div>
              <p className="mt-2 text-[10px] text-gray-400">Your contact information is required for project communication, quotations, approvals, invoices, and legal documentation. It is handled securely according to our privacy policy.</p>
              <div className="mt-2 flex gap-2">
                <button onClick={submitIntake} disabled={intakeBusy} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{intakeBusy ? "Submitting..." : "Submit request"}</button>
                <button onClick={() => setShowIntake(false)} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 dark:border-gray-600 dark:text-gray-300">Cancel</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            {!showIntake && !keyboardOpen && (
              <button
                type="button"
                onClick={() => setShowIntake(true)}
                className="mb-2 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300"
              >
                📋 Submit project request for review
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleVoice}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                title="Talk to AI"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  listening ? "animate-pulse bg-red-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 7v3m0-3a4 4 0 01-4-4V7a4 4 0 118 0v4a4 4 0 01-4 4z" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={listening ? "Listening..." : "Type or speak a message..."}
                disabled={isLoading}
                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
