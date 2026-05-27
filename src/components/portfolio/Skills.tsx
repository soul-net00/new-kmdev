"use client";

import { motion } from "framer-motion";
import type { SkillType } from "@/types";
import { SkillBar } from "./SkillBar";
import { ResponsiveCarousel } from "@/components/ui/ResponsiveCarousel";

export function Skills({ skills }: { skills: SkillType[] }) {
  const groups = ["Frontend", "Backend", "Database", "Networking", "Tools"] as const;
  const groupsWithSkills = groups.filter((group) => skills.some((skill) => skill.group === group));

  if (groupsWithSkills.length === 0) return null;

  return (
    <motion.section
      id="skills"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 md:px-6 md:py-16 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">Skills</p>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-balance md:text-4xl">Technical expertise</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          A practical stack for fast interfaces, reliable data, and maintainable delivery.
        </p>
      </div>
      
      <ResponsiveCarousel
        items={groupsWithSkills.map((group) => ({ key: group }))}
        itemsPerPage={{ mobile: 1, tablet: 2, desktop: 3 }}
        ariaLabel="Skills carousel"
      >
        {groupsWithSkills.map((group) => (
          <div
            key={group}
            className="group h-full rounded-2xl border border-white/10 bg-white/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_0_34px_rgba(16,185,129,0.18)] dark:bg-slate-900/80 lg:rounded-3xl lg:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{group}</h3>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs text-emerald-500 dark:text-emerald-300">
                {skills.filter((skill) => skill.group === group).length}
              </span>
            </div>
            {skills.filter((skill) => skill.group === group).map((skill) => <SkillBar key={skill._id} skill={skill} />)}
          </div>
        ))}
      </ResponsiveCarousel>
    </motion.section>
  );
}
