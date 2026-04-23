import type { SkillType } from "@/types";

export function SkillBar({ skill }: { skill: SkillType }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{skill.name}</span>
        <span className="font-mono text-emerald-600">{skill.percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" style={{ width: `${skill.percentage}%` }} />
      </div>
    </div>
  );
}
