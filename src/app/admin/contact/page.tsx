"use client";

import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ContactSection {
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export default function AdminContactPage() {
  const [settings, setSettings] = useState<{ contact: ContactSection } | null>(null);
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
        <h2 className="text-2xl font-bold text-white">Contact Settings</h2>
        <p className="text-slate-400">Manage your contact information</p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-white">Contact Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Phone</label>
            <Input
              value={settings.contact.phone}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
              className="bg-slate-800 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">WhatsApp</label>
            <Input
              value={settings.contact.whatsapp}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: e.target.value } })}
              className="bg-slate-800 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Email</label>
            <Input
              value={settings.contact.email}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
              className="bg-slate-800 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Location</label>
            <Input
              value={settings.contact.location}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, location: e.target.value } })}
              className="bg-slate-800 text-white"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white pt-4">Social Links</h3>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-slate-400">GitHub</label>
            <Input
              value={settings.contact.social.github}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, social: { ...settings.contact.social, github: e.target.value } } })}
              className="bg-slate-800 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">LinkedIn</label>
            <Input
              value={settings.contact.social.linkedin}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, social: { ...settings.contact.social, linkedin: e.target.value } } })}
              className="bg-slate-800 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Twitter</label>
            <Input
              value={settings.contact.social.twitter}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, social: { ...settings.contact.social, twitter: e.target.value } } })}
              className="bg-slate-800 text-white"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}