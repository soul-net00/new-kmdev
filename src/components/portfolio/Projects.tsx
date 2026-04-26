"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;
const ITEMS_PER_PAGE = 3;

export function Projects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const filtered = useMemo(() => active === "All" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const availableFilters = useMemo(() => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)), [projects]);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (projects.length === 0) return null;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visibleProjects = filtered.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.clientWidth / ITEMS_PER_PAGE;
      container.scrollTo({ left: page * cardWidth * ITEMS_PER_PAGE, behavior: "smooth" });
    }
  }, []);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Projects</p>
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold md:text-4xl">Featured work</h2>
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => (
            <button key={filter} onClick={() => { setActive(filter); setCurrentPage(0); }} className={`rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm ${active === filter ? "bg-emerald-500 text-slate-950" : "border border-slate-300 dark:border-slate-700"}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:grid sm:snap-none sm:overflow-visible sm:grid-cols-3 sm:gap-4 sm:px-0 sm:pb-0"
        >
          {filtered.map((project) => (
            <div key={project._id} className="w-[85vw] snap-center shrink-0 sm:w-auto">
              <ProjectCard project={project} />
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
          <div className="flex justify-center gap-1.5 pb-2 md:hidden">
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
