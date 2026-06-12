"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SkillType } from "@/types";

export function SkillBar({ skill }: { skill: SkillType }) {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, skill.percentage));

  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium text-slate-700 dark:text-slate-200">{skill.name}</span>
        <span className="shrink-0 font-mono text-emerald-600 dark:text-emerald-300">{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
          initial={{ width: reduceMotion ? `${pct}%` : 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          role="progressbar"
          aria-label={`${skill.name} proficiency`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        />
      </div>
    </div>
  );
}
