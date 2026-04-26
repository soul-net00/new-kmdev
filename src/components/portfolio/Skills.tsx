"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SkillType } from "@/types";
import { SkillBar } from "./SkillBar";

const ITEMS_PER_PAGE_MOBILE = 1;
const ITEMS_PER_PAGE_DESKTOP = 3;

export function Skills({ skills }: { skills: SkillType[] }) {
  const groups = ["Frontend", "Backend", "Database", "Networking", "Tools"] as const;
  const groupsWithSkills = groups.filter((group) => skills.some((skill) => skill.group === group));
  const [currentPage, setCurrentPage] = useState(0);

  if (groupsWithSkills.length === 0) return null;

  const totalPages = Math.ceil(groupsWithSkills.length / ITEMS_PER_PAGE_MOBILE);
  const visibleGroups = groupsWithSkills.slice(currentPage * ITEMS_PER_PAGE_MOBILE, (currentPage + 1) * ITEMS_PER_PAGE_MOBILE);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-10 md:py-16 overflow-hidden">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">SKILLS</p>
      <h2 className="text-xl font-bold md:text-4xl">Technical Expertise</h2>
      
      <div className="relative mt-6 md:mt-8">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
          {groupsWithSkills.map((group) => (
            <div key={group} className="w-[90vw] snap-center shrink-0 sm:w-auto">
              <motion.div
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:rounded-3xl lg:p-6"
              >
                <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">{group}</h3>
                {skills.filter((skill) => skill.group === group).map((skill) => <SkillBar key={skill._id} skill={skill} />)}
              </motion.div>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-2 sm:hidden">
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
