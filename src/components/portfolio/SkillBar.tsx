import type { SkillType } from "@/types";

export function SkillBar({ skill }: { skill: SkillType }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium text-slate-700 dark:text-slate-200">{skill.name}</span>
        <span className="shrink-0 font-mono text-emerald-600 dark:text-emerald-300">{skill.percentage}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 shadow-[0_0_18px_rgba(52,211,153,0.35)] transition-[width] duration-700 ease-out"
          style={{ width: `${skill.percentage}%` }}
          role="progressbar"
          aria-label={`${skill.name} proficiency`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={skill.percentage}
        />
      </div>
    </div>
  );
}
