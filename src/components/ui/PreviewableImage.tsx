"use client";

import { useState } from "react";
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal";

interface PreviewableImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackEmoji?: string;
  showSparkle?: boolean;
}

export function PreviewableImage({
  src,
  alt,
  className = "",
  fallbackEmoji = "KM",
  showSparkle = false
}: PreviewableImageProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!src) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 ${className}`}>
        <span className="font-mono text-2xl font-bold text-emerald-500">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`group relative overflow-hidden ${className} rounded-2xl border border-transparent transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]`}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {showSparkle && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/12 via-transparent to-cyan-300/12" />
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPreviewOpen(true);
          }}
          className="absolute inset-0 z-20 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          aria-label={`Preview ${alt}`}
        >
          <span className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white/92 text-sm font-medium text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </span>
        </button>
      </div>

      <ImagePreviewModal
        src={src}
        alt={alt}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
