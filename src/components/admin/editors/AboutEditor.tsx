"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

interface AboutForm {
  text: string;
  image: string;
  highlights: string[];
}

const defaultAbout: AboutForm = {
  text: "",
  image: "",
  highlights: []
};

export function AboutEditor() {
  const [form, setForm] = useState<AboutForm>(defaultAbout);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/site-settings").then((res) => res.json()).then((data) => {
      if (data?.about) {
        setForm({
          text: data.about.text || "",
          image: data.about.image || "",
          highlights: data.about.highlights || []
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
      body: JSON.stringify({ ...settings, about: form })
    });
    setSaving(false);
    setMessage(response.ok ? "About updated." : "Failed to update about section.");
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold">About section</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">About Text</span>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        
        <AdminImageInput
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          label="About Image"
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Highlights (comma separated)</span>
          <input
            value={form.highlights.join(", ")}
            onChange={(e) => setForm({ ...form, highlights: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save about"}</Button>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </div>
  );
}
