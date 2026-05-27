"use client";

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ResponsiveCarousel({
  children,
  items,
  itemsPerPage = { mobile: 1, tablet: 2, desktop: 3 },
  showDots = true,
  showArrows = true,
  className = "",
  itemClassName = "",
  ariaLabel = "Carousel"
}: ResponsiveCarouselProps) {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const itemCount = items?.length ?? slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage.mobile);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(itemCount / visibleCount));
  const activePage = clamp(Math.floor(activeIndex / visibleCount), 0, totalPages - 1);

  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return itemsPerPage.mobile;
    if (window.matchMedia("(min-width: 1024px)").matches) return itemsPerPage.desktop;
    if (window.matchMedia("(min-width: 640px)").matches) return itemsPerPage.tablet;
    return itemsPerPage.mobile;
  }, [itemsPerPage.desktop, itemsPerPage.mobile, itemsPerPage.tablet]);

  const getCardStep = useCallback(() => {
    const container = containerRef.current;
    const firstCard = container?.querySelector<HTMLElement>("[data-carousel-item]");
    if (!container || !firstCard) return 0;
    const gap = parseFloat(window.getComputedStyle(container).columnGap || "0");
    return firstCard.offsetWidth + gap;
  }, []);

  const goToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container || itemCount === 0) return;
    const nextIndex = clamp(index, 0, Math.max(0, itemCount - visibleCount));
    const cardStep = getCardStep();
    container.scrollTo({ left: nextIndex * cardStep, behavior: "smooth" });
    setActiveIndex(nextIndex);
  }, [getCardStep, itemCount, visibleCount]);

  const goToPage = useCallback((page: number) => {
    goToIndex(page * visibleCount);
  }, [goToIndex, visibleCount]);

  const nextPage = useCallback(() => {
    goToPage(activePage + 1);
  }, [activePage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(activePage - 1);
  }, [activePage, goToPage]);

  const handleScroll = useCallback(() => {
    if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    scrollRaf.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      const cardStep = getCardStep();
      if (!container || !cardStep) return;
      const nextIndex = clamp(Math.round(container.scrollLeft / cardStep), 0, Math.max(0, itemCount - visibleCount));
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    });
  }, [getCardStep, itemCount, visibleCount]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextPage();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevPage();
    }
  }, [nextPage, prevPage]);

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount());
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, [getVisibleCount]);

  useEffect(() => {
    goToIndex(clamp(activeIndex, 0, Math.max(0, itemCount - visibleCount)));
  }, [activeIndex, goToIndex, itemCount, visibleCount]);

  if (itemCount === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
        className="no-scrollbar -mx-4 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:-mx-6 sm:gap-6 sm:px-6 lg:-mx-2 lg:px-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {slides.map((slide, index) => (
          <div
            key={items?.[index]?.key ?? index}
            data-carousel-item
            className={`w-[90vw] shrink-0 snap-center sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] ${itemClassName}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {showArrows && totalPages > 1 && (
        <>
          <button
            type="button"
            onClick={prevPage}
            disabled={activePage === 0}
            className="absolute -left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-950/80 text-white shadow-[0_0_24px_rgba(16,185,129,0.22)] backdrop-blur transition duration-300 hover:-translate-x-0.5 hover:border-emerald-300 hover:bg-emerald-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-30 lg:flex"
            aria-label="Previous carousel page"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextPage}
            disabled={activePage === totalPages - 1}
            className="absolute -right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-950/80 text-white shadow-[0_0_24px_rgba(16,185,129,0.22)] backdrop-blur transition duration-300 hover:translate-x-0.5 hover:border-emerald-300 hover:bg-emerald-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-30 lg:flex"
            aria-label="Next carousel page"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2" aria-label="Carousel pagination">
          {Array.from({ length: totalPages }).map((_, page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                activePage === page ? "w-8 bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.45)]" : "w-2.5 bg-slate-400/50 hover:bg-emerald-300/70"
              }`}
              aria-label={`Go to carousel page ${page + 1}`}
              aria-current={activePage === page ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
