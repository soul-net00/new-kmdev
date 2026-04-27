"use client";

import { useState, useCallback, useRef } from "react";
import type { SkillType } from "@/types";
import { SkillBar } from "./SkillBar";

export function Skills({ skills }: { skills: SkillType[] }) {
  const groups = ["Frontend", "Backend", "Database", "Networking", "Tools"] as const;
  const groupsWithSkills = groups.filter((group) => skills.some((skill) => skill.group === group));
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (groupsWithSkills.length === 0) return null;

  const totalPages = Math.ceil(groupsWithSkills.length / 1);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: page * cardWidth, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRef.current && window.innerWidth < 1024) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.clientWidth;
      const newPage = Math.round(scrollLeft / cardWidth);
      if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
        setCurrentPage(newPage);
      }
    }
  }, [currentPage, totalPages]);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">SKILLS</p>
      <h2 className="text-xl font-bold md:text-4xl">Technical Expertise</h2>
      
      <div className="relative mt-6 md:mt-8">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0 lg:snap-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {groupsWithSkills.map((group) => (
            <div key={group} className="w-[85vw] flex-shrink-0 snap-center pr-2 sm:w-auto sm:pr-0 lg:basis-1/3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:rounded-3xl lg:p-6">
                <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">{group}</h3>
                {skills.filter((skill) => skill.group === group).map((skill) => <SkillBar key={skill._id} skill={skill} />)}
              </div>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => goToPage(i)}
                className={`h-2 w-2 rounded-full transition-colors ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
