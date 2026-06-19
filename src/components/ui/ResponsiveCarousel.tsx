"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface ResponsiveCarouselProps {
  children: ReactNode;
  items?: { key: string }[];
  itemsPerPage?: { mobile: number; tablet: number; desktop: number };
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
}

export function ResponsiveCarousel({ children, items, showDots = true, showArrows = true, className = "", ariaLabel = "Carousel" }: ResponsiveCarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number; locked: "h" | "v" | null; time: number }>({ x: 0, y: 0, locked: null, time: 0 });
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Wrap index for infinite loop
  const wrap = (i: number) => ((i % count) + count) % count;

  // Navigate
  const goTo = useCallback((i: number) => { setActive(wrap(i)); setDragX(0); }, [count]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused || count <= 1) return;
    autoRef.current = setInterval(next, 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [paused, next, count]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Touch/mouse drag — gesture angle locking
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    touch.current = { x: e.clientX, y: e.clientY, locked: null, time: Date.now() };
    setDragging(true);
    setPaused(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;

    // Determine lock direction (first 8px of movement)
    if (!touch.current.locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      touch.current.locked = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
    }

    // Vertical? Surrender immediately — let page scroll
    if (touch.current.locked === "v") {
      setDragging(false);
      setDragX(0);
      return;
    }

    if (touch.current.locked === "h") {
      setDragX(dx);
    }
  }, [dragging]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging) { setPaused(false); return; }
    setDragging(false);
    const dx = e.clientX - touch.current.x;
    const dt = Date.now() - touch.current.time;
    const velocity = Math.abs(dx) / Math.max(dt, 1);
    const threshold = containerRef.current ? containerRef.current.clientWidth * 0.2 : 80;

    // Swipe detection: distance OR velocity
    if (dx < -threshold || (dx < -20 && velocity > 0.4)) next();
    else if (dx > threshold || (dx > 20 && velocity > 0.4)) prev();

    setDragX(0);
    setTimeout(() => setPaused(false), 100);
  }, [dragging, next, prev]);

  // Card positioning via transforms
  const getStyle = (index: number): React.CSSProperties => {
    let offset = index - active;
    // Wrap for infinite: choose shortest path
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;

    const dragOffset = dragging ? dragX : 0;
    const baseTranslate = offset * 75; // % spacing between cards
    const pixelDrag = (dragOffset / (containerRef.current?.clientWidth || 400)) * 75;
    const translateX = baseTranslate + pixelDrag;

    const isCenter = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;
    const scale = isCenter ? 1 : isAdjacent ? 0.82 : 0.7;
    const opacity = isCenter ? 1 : isAdjacent ? 0.55 : 0;
    const blur = isCenter ? 0 : isAdjacent ? 1 : 4;
    const z = isCenter ? 10 : isAdjacent ? 5 : 1;

    return {
      position: "absolute" as const,
      left: "50%",
      top: 0,
      width: "82%",
      maxWidth: "380px",
      transform: `translate3d(calc(-50% + ${translateX}%), 0, 0) scale(${scale})`,
      opacity: Math.abs(offset) > 2 ? 0 : opacity,
      filter: `blur(${blur}px)`,
      zIndex: z,
      transition: dragging ? "none" : `transform 0.4s cubic-bezier(0.32,0.72,0,1), opacity 0.4s ease, filter 0.4s ease`,
      willChange: "transform",
      pointerEvents: isCenter ? "auto" as const : "auto" as const,
    };
  };

  if (count === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative mx-auto w-full select-none overflow-hidden"
        style={{ height: "auto", minHeight: "30rem", touchAction: "pan-y" }}
      >
        {slides.map((slide, i) => (
          <div
            key={items?.[i]?.key ?? i}
            data-carousel-item
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${count}`}
            onClick={() => { if (i !== active && !dragging) goTo(i); }}
            style={getStyle(i)}
            className="cursor-pointer"
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Arrow buttons */}
      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/60 hover:shadow-[0_0_16px_rgba(79,220,255,0.3)] active:scale-95 sm:left-4 sm:h-12 sm:w-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/60 hover:shadow-[0_0_16px_rgba(79,220,255,0.3)] active:scale-95 sm:right-4 sm:h-12 sm:w-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && count > 1 && (
        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-7 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "w-2 bg-white/15 hover:bg-white/30"}`}
            />
          ))}
        </div>
      )}

      {/* Progress counter */}
      <div className="mt-3 text-center">
        <span className="text-[11px] font-mono tabular-nums text-slate-500">{active + 1} / {count}</span>
      </div>
    </div>
  );
}
