"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex = 0, open, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTap = useRef(0);
  const prevBodyOverflow = useRef("");

  // Reset state when opening or changing image
  useEffect(() => { setIndex(initialIndex); }, [initialIndex]);
  useEffect(() => { setZoom(1); setPan({ x: 0, y: 0 }); setLoaded(false); }, [index]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      prevBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevBodyOverflow.current;
    }
    return () => { document.body.style.overflow = prevBodyOverflow.current; };
  }, [open]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") { setIndex((i) => (i + 1) % images.length); }
      else if (e.key === "ArrowLeft") { setIndex((i) => (i - 1 + images.length) % images.length); }
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 3));
      else if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, images.length, onClose]);

  // Auto-hide controls on desktop
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    if (open) resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [open, resetHideTimer]);

  // Pan when zoomed (mouse)
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    resetHideTimer();
    if (!dragStart.current) return;
    setPan({ x: dragStart.current.px + (e.clientX - dragStart.current.x), y: dragStart.current.py + (e.clientY - dragStart.current.y) });
  };
  const onMouseUp = () => { dragStart.current = null; };

  // Touch: swipe between images, double-tap zoom, swipe down close
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;

    // Double tap to zoom
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setZoom((z) => z > 1 ? 1 : 2);
      setPan({ x: 0, y: 0 });
      lastTap.current = 0;
      touchStart.current = null;
      return;
    }
    lastTap.current = now;

    if (zoom > 1) { touchStart.current = null; return; }

    // Swipe down to close
    if (dy > 100 && Math.abs(dx) < 80) { onClose(); touchStart.current = null; return; }

    // Swipe left/right to navigate
    const velocity = Math.abs(dx) / Math.max(dt, 1);
    if (dx < -60 || (dx < -20 && velocity > 0.3)) setIndex((i) => (i + 1) % images.length);
    else if (dx > 60 || (dx > 20 && velocity > 0.3)) setIndex((i) => (i - 1 + images.length) % images.length);

    touchStart.current = null;
  };

  // Wheel zoom (desktop)
  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.01, 1), 3));
    }
  };

  // Tap to toggle controls (mobile)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open || images.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
          onClick={handleOverlayClick}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          role="dialog"
          aria-modal="true"
          aria-label="Project image preview"
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-5 right-5 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Close preview"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </motion.button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <motion.div animate={{ opacity: showControls ? 1 : 0 }} transition={{ duration: 0.2 }} className="pointer-events-none absolute inset-x-0 top-1/2 z-[105] flex -translate-y-1/2 justify-between px-4">
              <button onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-110" aria-label="Previous image">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-110" aria-label="Next image">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </motion.div>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <motion.div animate={{ opacity: showControls ? 1 : 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-mono text-white/70 backdrop-blur-md">
              {index + 1} / {images.length}
            </motion.div>
          )}

          {/* Image */}
          <motion.div
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="relative max-h-[90vh] max-w-[90vw] sm:max-h-[90vh] sm:max-w-[90vw]"
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={(e) => { e.stopPropagation(); setShowControls((s) => !s); }}
            style={{ cursor: zoom > 1 ? "grab" : "default" }}
          >
            {/* Skeleton */}
            {!loaded && (
              <div className="flex h-[60vh] w-[80vw] max-w-[800px] items-center justify-center rounded-xl bg-white/5">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
              </div>
            )}
            <img
              src={images[index]}
              alt={`Screenshot ${index + 1}`}
              onLoad={() => setLoaded(true)}
              className={`rounded-xl object-contain select-none transition-transform duration-200 ${loaded ? "" : "sr-only"}`}
              style={{
                maxHeight: "90vh",
                maxWidth: "90vw",
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                willChange: "transform",
              }}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
