"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { SkillType } from "@/types";
import { SkillCard } from "./SkillCard";

export function Skills({ skills }: { skills: SkillType[] }) {
  // Order by proficiency (highest first) so the most important skills lead,
  // then split into prominence tiers: top 3 are largest, next 3 medium, rest small.
  const { top, mid, rest } = useMemo(() => {
    const sorted = [...skills].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    return {
      top: sorted.slice(0, 3),
      mid: sorted.slice(3, 6),
      rest: sorted.slice(6)
    };
  }, [skills]);

  if (skills.length === 0) return null;

  return (
    <motion.section
      id="skills"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 md:px-6 md:py-28 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">Skills</p>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-balance md:text-4xl">Technical expertise</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Ordered by proficiency — the strongest tools lead, supporting skills follow.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Tier 1 — highest proficiency, most prominent */}
        {top.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {top.map((skill, i) => (
              <SkillCard key={skill._id || skill.name} skill={skill} tier="lg" index={i} />
            ))}
          </div>
        )}

        {/* Tier 2 — medium */}
        {mid.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {mid.map((skill, i) => (
              <SkillCard key={skill._id || skill.name} skill={skill} tier="md" index={i} />
            ))}
          </div>
        )}

        {/* Tier 3 — supporting skills, compact */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {rest.map((skill, i) => (
              <SkillCard key={skill._id || skill.name} skill={skill} tier="sm" index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
