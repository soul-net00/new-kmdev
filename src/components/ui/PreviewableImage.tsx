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
          loading="lazy"
          decoding="async"
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
          className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          aria-label={`Preview ${alt}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
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
