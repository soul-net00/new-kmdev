"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminImageInput } from "@/components/admin/AdminImageInput";
import type { ProjectType } from "@/types";

const emptyForm: ProjectType = {
  title: "",
  description: "",
  category: "Web",
  techStack: [],
  githubUrl: "",
  liveUrl: "",
  image: "",
  featured: false
};

export function ProjectEditor() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [form, setForm] = useState<ProjectType>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    setLoading(true);
    const data = await fetch("/api/projects").then((res) => res.json());
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function submit() {
    setSaving(true);
    const payload = { ...form, techStack: form.techStack.filter(Boolean) };
    const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      await loadProjects();
    }
    setSaving(false);
  }

  async function remove(id?: string) {
    if (!id) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await loadProjects();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Project editor</h2>
          {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</Button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
          <Select label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value as ProjectType["category"] })} options={["Web", "Desktop", "Database", "Other"]} />
          <div className="md:col-span-2"><Input label="Description" value={form.description} multiline onChange={(value) => setForm({ ...form, description: value })} /></div>
          <div className="md:col-span-2">
            <AdminImageInput
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
              label="Image"
            />
          </div>
          <Input label="Tech stack (comma separated)" value={form.techStack.join(", ")} onChange={(value) => setForm({ ...form, techStack: value.split(",").map((item) => item.trim()) })} />
          <Input label="GitHub URL" value={form.githubUrl || ""} onChange={(value) => setForm({ ...form, githubUrl: value })} />
          <Input label="Live URL" value={form.liveUrl || ""} onChange={(value) => setForm({ ...form, liveUrl: value })} />
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700">
            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured project
          </label>
        </div>
        <div className="mt-4"><Button onClick={submit} disabled={saving}>{saving ? "Saving..." : editingId ? "Update project" : "Create project"}</Button></div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold">Existing projects</h3>
        {loading ? <p className="text-sm text-slate-500">Loading projects...</p> : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.techStack.map((tag) => <span key={tag} className="rounded-full border border-slate-300 px-2 py-1 text-xs dark:border-slate-700">{tag}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => { setEditingId(project._id || null); setForm({ ...project, techStack: project.techStack || [] }); }}>Edit</Button>
                    <Button variant="ghost" className="text-red-500" onClick={() => remove(project._id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /> : <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" />}
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
