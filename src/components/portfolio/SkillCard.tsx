"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SkillType } from "@/types";

type Tier = "lg" | "md" | "sm";

const tierStyles: Record<Tier, { card: string; name: string; pct: string; bar: string }> = {
  lg: { card: "p-5 sm:p-6", name: "text-lg sm:text-xl", pct: "text-2xl sm:text-3xl", bar: "h-3" },
  md: { card: "p-4 sm:p-5", name: "text-base sm:text-lg", pct: "text-xl sm:text-2xl", bar: "h-2.5" },
  sm: { card: "p-3 sm:p-4", name: "text-sm sm:text-base", pct: "text-base sm:text-lg", bar: "h-2" }
};

export function SkillCard({ skill, tier }: { skill: SkillType; tier: Tier }) {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, skill.percentage));
  const s = tierStyles[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group h-full rounded-2xl border border-white/10 bg-white/80 ${s.card} shadow-[0_18px_60px_rgba(2,6,23,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_0_34px_rgba(16,185,129,0.18)] dark:bg-slate-900/80`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`min-w-0 truncate font-semibold ${s.name}`}>{skill.name}</h3>
        <span className={`shrink-0 font-mono font-bold text-emerald-600 dark:text-emerald-300 ${s.pct}`}>{pct}%</span>
      </div>
      {skill.group && (
        <span className="mt-1 inline-block rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
          {skill.group}
        </span>
      )}
      <div className={`mt-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800 ${s.bar}`}>
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
    </motion.div>
  );
}
