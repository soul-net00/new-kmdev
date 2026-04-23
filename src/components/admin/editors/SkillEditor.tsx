"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { SkillType } from "@/types";

const emptyForm: SkillType = { name: "", percentage: 70, group: "Frontend" };

export function SkillEditor() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [form, setForm] = useState<SkillType>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadSkills() {
    const data = await fetch("/api/skills").then((res) => res.json());
    setSkills(data);
  }

  useEffect(() => { loadSkills(); }, []);

  async function submit() {
    const response = await fetch(editingId ? `/api/skills/${editingId}` : "/api/skills", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      await loadSkills();
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    await loadSkills();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">Skill editor</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Skill name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Percentage</span><input type="number" min={0} max={100} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Group</span><select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value as SkillType["group"] })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"><option>Frontend</option><option>Backend</option><option>Database</option><option>Networking</option><option>Tools</option></select></label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={submit}>{editingId ? "Update skill" : "Create skill"}</Button>
          {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</Button>}
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold">Existing skills</h3>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <div className="font-semibold">{skill.name}</div>
                <div className="text-sm text-slate-500">{skill.group} · {skill.percentage}%</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setEditingId(skill._id || null); setForm(skill); }}>Edit</Button>
                <Button variant="ghost" className="text-red-500" onClick={() => remove(skill._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
