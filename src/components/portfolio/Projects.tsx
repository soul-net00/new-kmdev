"use client";

import { useMemo, useState, useRef } from "react";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;

export function Projects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const filtered = useMemo(() => active === "All" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const availableFilters = useMemo(() => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)), [projects]);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (projects.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Projects</p>
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold md:text-4xl">Featured work</h2>
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => (
            <button key={filter} onClick={() => setActive(filter)} className={`rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm ${active === filter ? "bg-emerald-500 text-slate-950" : "border border-slate-300 dark:border-slate-700"}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative">
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:block sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 sm:pb-0 lg:grid-cols-3">
          {filtered.map((project) => (
            <div key={project._id} className="w-[85vw] snap-center shrink-0 sm:w-auto">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        
        {filtered.length > 3 && (
          <>
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 z-10 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900" aria-label="Scroll left">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 z-10 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900" aria-label="Scroll right">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        
        <div className="flex justify-center gap-1.5 pb-2 md:hidden">
          {filtered.map((_, i) => (
            <button key={i} className="dot-indicator h-2 w-2 rounded-full bg-slate-300" aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
