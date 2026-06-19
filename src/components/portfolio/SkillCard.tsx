"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SkillType } from "@/types";

type Tier = "lg" | "md" | "sm";

const tierStyles: Record<Tier, { card: string; name: string; pct: string; bar: string }> = {
  lg: { card: "p-5 sm:p-6", name: "text-base sm:text-lg", pct: "text-xl sm:text-2xl", bar: "h-2.5" },
  md: { card: "p-4 sm:p-5", name: "text-sm sm:text-base", pct: "text-lg sm:text-xl", bar: "h-2" },
  sm: { card: "p-3 sm:p-4", name: "text-xs sm:text-sm", pct: "text-sm sm:text-base", bar: "h-1.5" },
};

export function SkillCard({ skill, tier, index = 0 }: { skill: SkillType; tier: Tier; index?: number }) {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, skill.percentage));
  const s = tierStyles[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16, filter: reduceMotion ? "none" : "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
      className={`group relative h-full overflow-hidden rounded-2xl border border-gray-200/60 bg-white ${s.card} shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] dark:border-white/[0.06] dark:bg-slate-900/90 dark:shadow-[0_2px_16px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_40px_rgba(16,185,129,0.06)]`}
    >
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(120px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16,185,129,0.06), transparent)" }} />

      <div className="relative flex items-baseline justify-between gap-3">
        <h3 className={`min-w-0 truncate font-semibold tracking-tight ${s.name}`}>{skill.name}</h3>
        <span className={`shrink-0 font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-300 ${s.pct}`}>{pct}%</span>
      </div>
      {skill.group && (
        <span className="mt-1.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-500">
          {skill.group}
        </span>
      )}
      <div className={`mt-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${s.bar}`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 dark:from-emerald-400 dark:to-cyan-300"
          initial={{ width: reduceMotion ? `${pct}%` : "0%" }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.04, ease: [0.32, 0.72, 0, 1] }}
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
