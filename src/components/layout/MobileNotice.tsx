"use client";

import { useState, useEffect } from "react";

export function MobileNotice() {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 shadow-lg md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.66 16.926c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium">
            For the best experience, desktop view is recommended 📱➡️💻
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 rounded-full bg-white/20 p-1 text-white hover:bg-white/30 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}