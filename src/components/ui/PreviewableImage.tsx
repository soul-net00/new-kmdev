"use client";

import { useState, useCallback } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <span className="text-4xl">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`group relative overflow-hidden ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1.05 : 1,
            filter: isHovered ? "brightness(1.05)" : "brightness(1)",
            willChange: "opacity, filter"
          }}
        />
        
        {showSparkle && isHovered && (
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="sparkle-glow absolute inset-0 rounded-inherit bg-gradient-to-br from-emerald-400/10 via-transparent to-blue-400/10" />
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPreviewOpen(true);
          }}
          className="absolute inset-0 z-20 flex items-center justify-center"
          aria-label={`Preview ${alt}`}
        >
          <span 
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm font-medium text-gray-900 shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
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