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
  fallbackEmoji = "🖼️",
  showSparkle = true
}: PreviewableImageProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <span className="text-4xl">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <>
      <div className={`group relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-110"
        />
        
        {showSparkle && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-blue-400/20" />
            <div className="sparkle-1 absolute top-2 right-2 h-2 w-2 rounded-full bg-white animate-sparkle" />
            <div className="sparkle-2 absolute bottom-4 left-4 h-1.5 w-1.5 rounded-full bg-emerald-300 animate-sparkle-delayed" />
            <div className="sparkle-3 absolute top-1/2 right-4 h-1 w-1 rounded-full bg-blue-300 animate-sparkle" />
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPreviewOpen(true);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm font-medium text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-110">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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