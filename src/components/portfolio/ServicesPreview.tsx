"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ServiceType } from "@/types";
import { currency } from "@/lib/utils";

export function ServicesPreview({ services }: { services: ServiceType[] }) {
  if (!services || services.length === 0) return null;
  
  const previewServices = services.slice(0, 3);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

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
        <div ref={scrollRef} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:block sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:px-0 sm:pb-0">
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
        
        {previewServices.length > 2 && (
          <>
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 z-10 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900" aria-label="Scroll left">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 z-10 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900" aria-label="Scroll right">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        
        <div className="flex justify-center gap-1.5 pb-2 sm:hidden">
          {previewServices.map((_, i) => (
            <button key={i} className="dot-indicator h-2 w-2 rounded-full bg-slate-300" aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
