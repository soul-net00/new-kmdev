"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import type { ServiceType } from "@/types";
import { currency } from "@/lib/utils";

const ITEMS_PER_PAGE = 3;

export function ServicesPreview({ services }: { services: ServiceType[] }) {
  if (!services || services.length === 0) return null;
  
  const previewServices = services.slice(0, 3);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(previewServices.length / ITEMS_PER_PAGE);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.clientWidth / ITEMS_PER_PAGE;
      container.scrollTo({ left: page * cardWidth * ITEMS_PER_PAGE, behavior: "smooth" });
    }
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Services</p>
          <h2 className="text-2xl font-bold md:text-4xl">What I can help you with</h2>
        </div>
        <Link href="/services" className="text-sm font-semibold text-emerald-600 whitespace-nowrap">
          View all services →
        </Link>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:grid sm:snap-none sm:overflow-visible sm:grid-cols-3 sm:gap-4 sm:px-0 sm:pb-0"
        >
          {previewServices.map((service) => (
            <div key={service.name} className="w-[85vw] snap-center shrink-0 sm:w-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              {service.image && (
                <img src={service.image} alt={service.name} className="w-full rounded-lg object-cover h-32 mb-3" />
              )}
              <h3 className="text-base font-semibold sm:text-lg">{service.name}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{service.description}</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600">From {currency(service.priceFrom)}</p>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <>
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 0}
              className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all hover:border-emerald-400 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 md:flex" 
              aria-label="Previous"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages - 1}
              className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all hover:border-emerald-400 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900 md:flex" 
              aria-label="Next"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 pb-2 sm:hidden">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => goToPage(i)}
                className={`h-2 w-2 rounded-full transition-colors ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"}`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
