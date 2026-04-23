"use client";

import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

interface AboutSection {
  text: string;
  image: string;
  highlights: string[];
}

export default function AdminAboutPage() {
  const [settings, setSettings] = useState<{ about: AboutSection } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings().then((data: any) => setSettings(data));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">About Editor</h2>
        <p className="text-slate-400">Manage your about page content</p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-white">About Section</h3>
        
        <div>
          <label className="mb-1 block text-sm text-slate-400">About Text</label>
          <textarea
            value={settings.about.text}
            onChange={(e) => setSettings({ ...settings, about: { ...settings.about, text: e.target.value } })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            rows={8}
          />
        </div>
        
        <AdminImageInput
          value={settings.about.image}
          onChange={(url) => setSettings({ ...settings, about: { ...settings.about, image: url } })}
          label="Image"
        />

        <div>
          <label className="mb-1 block text-sm text-slate-400">Highlights (comma separated)</label>
          <Input
            value={settings.about.highlights.join(", ")}
            onChange={(e) => setSettings({ 
              ...settings, 
              about: { ...settings.about, highlights: e.target.value.split(",").map(s => s.trim()) } 
            })}
            className="bg-slate-800 text-white"
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}