"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

interface ResponsiveCarouselProps {
  children: ReactNode;
  items: { key: string }[];
  itemsPerPage: { mobile: number; tablet: number; desktop: number };
  showDots?: boolean;
  showArrows?: boolean;
}

export function ResponsiveCarousel({ 
  children, 
  items, 
  itemsPerPage = { mobile: 1, tablet: 2, desktop: 3 },
  showDots = true,
  showArrows = true 
}: ResponsiveCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerDesktop = itemsPerPage.desktop;
  const totalPages = Math.ceil(items.length / itemsPerDesktop);
  const totalMobilePages = items.length;

  const goToPage = useCallback((page: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth / itemsPerDesktop;
    container.scrollTo({ left: page * cardWidth, behavior: "smooth" });
    setCurrentPage(page);
  }, [itemsPerDesktop]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth / itemsPerDesktop;
    const newPage = Math.round(scrollLeft / cardWidth);
    if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  }, [currentPage, itemsPerDesktop, totalPages]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:snap-none sm:overflow-visible sm:pb-0"
        style={{
          gridTemplateColumns: `repeat(${itemsPerDesktop}, minmax(0, 1fr))`
        }}
      >
        {children}
      </div>

      {showArrows && totalPages > 1 && (
        <>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all hover:border-emerald-400 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all hover:border-emerald-400 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && totalPages > 1 && (
        <div className="flex justify-center gap-1.5 pb-2 pt-4 sm:hidden">
          {Array.from({ length: totalMobilePages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentPage === i 
                  ? "bg-emerald-500" 
                  : "bg-slate-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}