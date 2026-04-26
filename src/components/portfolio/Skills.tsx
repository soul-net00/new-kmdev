"use client";

import { useRef, useState, useCallback } from "react";
import type { SkillType } from "@/types";
import { SkillBar } from "./SkillBar";

const ITEMS_PER_PAGE = 3;

export function Skills({ skills }: { skills: SkillType[] }) {
  const groups = ["Frontend", "Backend", "Database", "Networking", "Tools"] as const;
  const groupsWithSkills = groups.filter((group) => skills.some((skill) => skill.group === group));
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (groupsWithSkills.length === 0) return null;

  const totalPages = Math.ceil(groupsWithSkills.length / ITEMS_PER_PAGE);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.clientWidth / ITEMS_PER_PAGE;
      container.scrollTo({ left: page * cardWidth * ITEMS_PER_PAGE, behavior: "smooth" });
    }
  }, []);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Skills</p>
      <h2 className="text-2xl font-bold md:text-4xl">Technical strengths</h2>
      
      <div className="relative mt-6 md:mt-8">
        <div 
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:grid sm:snap-none sm:overflow-visible sm:grid-cols-3 sm:gap-4 sm:px-0 sm:pb-0"
        >
          {groupsWithSkills.map((group) => (
            <div key={group} className="w-[80vw] max-w-[340px] snap-center shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 md:w-auto md:max-w-none md:rounded-2xl md:shadow-none md:hover:shadow-md md:hover:scale-100 lg:rounded-3xl lg:p-6 active:scale-[0.98]">
              <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">{group}</h3>
              {skills.filter((skill) => skill.group === group).map((skill) => <SkillBar key={skill._id} skill={skill} />)}
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
