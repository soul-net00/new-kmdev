"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

interface HeroForm {
  title: string;
  subtitle: string;
  intro: string;
  image: string;
  stats: { label: string; value: string }[];
  cta: { label: string; href: string }[];
}

const defaultHero: HeroForm = {
  title: "Full-stack Developer",
  subtitle: "Building practical IT solutions",
  intro: "",
  image: "",
  stats: [
    { label: "Projects", value: "10+" },
    { label: "Services", value: "5" },
    { label: "Years", value: "3+" }
  ],
  cta: []
};

export function HeroEditor() {
  const [form, setForm] = useState<HeroForm>(defaultHero);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/site-settings").then((res) => res.json()).then((data) => {
      if (data?.hero) {
        setForm({
          title: data.hero.title || "",
          subtitle: data.hero.subtitle || "",
          intro: data.hero.intro || "",
          image: data.hero.image || "",
          stats: data.hero.stats || defaultHero.stats,
          cta: data.hero.cta || []
        });
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    const settings = await fetch("/api/site-settings").then((res) => res.json());
    const response = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, hero: form })
    });
    setSaving(false);
    setMessage(response.ok ? "Hero updated." : "Failed to update hero.");
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold">Hero section</h2>
      <div className="space-y-4">
        <Field label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
        <Field label="Subtitle" value={form.subtitle} onChange={(value) => setForm({ ...form, subtitle: value })} />
        <Field label="Intro" value={form.intro} multiline onChange={(value) => setForm({ ...form, intro: value })} />
        
        <AdminImageInput
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          label="Profile Image"
        />

        {form.stats.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stat {index + 1}</div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Label"
                value={stat.label}
                onChange={(value) => {
                  const stats = [...form.stats];
                  stats[index] = { ...stats[index], label: value };
                  setForm({ ...form, stats });
                }}
              />
              <Field
                label="Value"
                value={stat.value}
                onChange={(value) => {
                  const stats = [...form.stats];
                  stats[index] = { ...stats[index], value };
                  setForm({ ...form, stats });
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save hero"}</Button>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
      )}
    </label>
  );
}
