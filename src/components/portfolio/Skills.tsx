import type { SkillType } from "@/types";
import { SkillBar } from "./SkillBar";

export function Skills({ skills }: { skills: SkillType[] }) {
  const groups = ["Frontend", "Backend", "Database", "Networking", "Tools"] as const;
  const groupsWithSkills = groups.filter((group) => skills.some((skill) => skill.group === group));

  if (groupsWithSkills.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Skills</p>
      <h2 className="text-2xl font-bold md:text-4xl">Technical strengths</h2>
      <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
        {groupsWithSkills.map((group) => (
          <div key={group} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:rounded-3xl md:p-6">
            <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">{group}</h3>
            {skills.filter((skill) => skill.group === group).map((skill) => <SkillBar key={skill._id} skill={skill} />)}
          </div>
        ))}
      </div>
    </section>
  );
}
