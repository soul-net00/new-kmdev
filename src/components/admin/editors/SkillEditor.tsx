"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { SkillType } from "@/types";

const emptyForm: SkillType = { name: "", percentage: 70, group: "Frontend" };

const SKILL_GROUPS = ["Frontend", "Backend", "Database", "Networking", "Tools", "Web Development", "Data & Systems", "System & Hardware", "Analysis"];

export function SkillEditor() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [form, setForm] = useState<SkillType>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected skill(s)?`)) return;
    
    setDeleting(true);
    for (const id of selectedIds) {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
    }
    setSelectedIds(new Set());
    setSelectAll(false);
    await loadSkills();
    setDeleting(false);
  }

  function toggleSelect(id: string) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(skills.map((s) => s._id || "")));
    }
    setSelectAll(!selectAll);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">Skill editor</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Skill name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Percentage</span><input type="number" min={0} max={100} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Group</span>
            <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value as SkillType["group"] })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950">
              {SKILL_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={submit}>{editingId ? "Update skill" : "Create skill"}</Button>
          {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</Button>}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Existing skills ({skills.length})</h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="rounded" />
              Select all
            </label>
            {selectedIds.size > 0 && (
              <Button variant="ghost" className="text-red-500" onClick={deleteSelected} disabled={deleting}>
                Delete {selectedIds.size} selected
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill._id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 dark:border-slate-800 ${selectedIds.has(skill._id || "") ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(skill._id || "")}
                  onChange={() => toggleSelect(skill._id || "")}
                  className="rounded"
                />
                <div>
                  <div className="font-semibold">{skill.name}</div>
                  <div className="text-sm text-slate-500">{skill.group} · {skill.percentage}%</div>
                </div>
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