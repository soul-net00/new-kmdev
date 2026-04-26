"use client";

import { useRef } from "react";
import type { SkillType } from "@/types";
import { SkillBar } from "./SkillBar";

export function Skills({ skills }: { skills: SkillType[] }) {
  const groups = ["Frontend", "Backend", "Database", "Networking", "Tools"] as const;
  const groupsWithSkills = groups.filter((group) => skills.some((skill) => skill.group === group));
  const scrollRef = useRef<HTMLDivElement>(null);

  if (groupsWithSkills.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Skills</p>
      <h2 className="text-2xl font-bold md:text-4xl">Technical strengths</h2>
      
      <div className="relative mt-6 md:mt-8">
        <div 
          ref={scrollRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:block sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 sm:pb-0 xl:grid-cols-3"
        >
          {groupsWithSkills.map((group) => (
            <div key={group} className="w-[80vw] max-w-[340px] snap-center shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 md:w-auto md:max-w-none md:rounded-2xl md:shadow-none md:hover:shadow-md md:hover:scale-100 lg:rounded-3xl lg:p-6 active:scale-[0.98]">
              <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">{group}</h3>
              {skills.filter((skill) => skill.group === group).map((skill) => <SkillBar key={skill._id} skill={skill} />)}
            </div>
          ))}
        </div>
        
        {groupsWithSkills.length > 2 && (
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
          {groupsWithSkills.map((_, i) => (
            <button key={i} className="dot-indicator h-2 w-2 rounded-full bg-slate-300 data-[active=true]:bg-emerald-500" data-active="true" aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
