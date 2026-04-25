"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sourceLabel?: string;
}

interface ChatResponse {
  reply: string;
  source: string;
  suggestions: string[];
  mode: string;
  sourceLabel: string;
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
      content: "Hi there! I'm KMDev AI. How can I help you today?",
      sourceLabel: "🧠 Auto"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [mode, setMode] = useState<ChatMode>("auto");
  const [showModeMenu, setShowModeMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          mode: mode
        })
      });

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "I'm here to help! What would you like to know about KMDev?",
        sourceLabel: data.sourceLabel || "🧠 Auto"
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
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
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className="w-screen max-w-md sm:w-full sm:max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
          style={{ height: "70vh", maxHeight: "500px" }}
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

            {showSuggestions && messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Quick questions:</p>
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

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
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