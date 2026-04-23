"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

interface HeroSection {
  title: string;
  subtitle: string;
  intro: string;
  image: string;
  stats: { label: string; value: string }[];
  cta: { label: string; href: string }[];
}

interface SiteSettingsData {
  hero: HeroSection;
  about: { text: string; image: string; highlights: string[] };
  contact: { email: string; whatsapp: string };
}

const defaultSettings: SiteSettingsData = {
  hero: {
    title: "Full-stack Developer",
    subtitle: "Building practical IT solutions",
    intro: "I build websites, databases, and admin systems that solve real problems.",
    image: "",
    stats: [
      { label: "Projects", value: "10+" },
      { label: "Services", value: "5" },
      { label: "Years", value: "3+" }
    ],
    cta: [
      { label: "Services", href: "/services" },
      { label: "Contact", href: "#contact" }
    ]
  },
  about: {
    text: "",
    image: "",
    highlights: []
  },
  contact: {
    email: "",
    whatsapp: ""
  }
};

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/site-settings");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setSettings(data || defaultSettings);
      } catch (err) {
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }
    load();
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

  if (loading) return <div className="text-slate-400">Loading...</div>;
  if (!settings) return <div className="text-slate-400">No settings found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Homepage Editor</h2>
        <p className="text-slate-400">Manage your hero section content</p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-white">Hero Section</h3>
        
        <div>
          <label className="mb-1 block text-sm text-slate-400">Title</label>
          <Input
            value={settings.hero.title}
            onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
            className="bg-slate-800 text-white"
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm text-slate-400">Subtitle</label>
          <Input
            value={settings.hero.subtitle}
            onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
            className="bg-slate-800 text-white"
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm text-slate-400">Intro Text</label>
          <textarea
            value={settings.hero.intro}
            onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, intro: e.target.value } })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            rows={4}
          />
        </div>
        
        <AdminImageInput
          value={settings.hero.image}
          onChange={(url) => setSettings({ ...settings, hero: { ...settings.hero, image: url } })}
          label="Profile Image"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {settings.hero.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Label"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...settings.hero.stats];
                  newStats[i] = { ...stat, label: e.target.value };
                  setSettings({ ...settings, hero: { ...settings.hero, stats: newStats } });
                }}
                className="bg-slate-800 text-white"
              />
              <Input
                placeholder="Value"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...settings.hero.stats];
                  newStats[i] = { ...stat, value: e.target.value };
                  setSettings({ ...settings, hero: { ...settings.hero, stats: newStats } });
                }}
                className="bg-slate-800 text-white"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}