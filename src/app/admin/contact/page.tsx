"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ContactSection {
  email: string;
  whatsapp: string;
}

export default function AdminContactPage() {
  const [settings, setSettings] = useState<{ contact: ContactSection } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contact) {
          setSettings({ contact: data.contact });
        } else {
          setSettings({ contact: { email: "", whatsapp: "" } });
        }
      })
      .catch(() => {
        setSettings({ contact: { email: "", whatsapp: "" } });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings");
      const current = await res.json();
      const saveRes = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, contact: settings.contact })
      });
      if (saveRes.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;
  if (!settings) return <div className="text-slate-400">Error loading settings</div>;

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
            <label className="mb-1 block text-sm text-slate-400">Email</label>
            <Input
              value={settings.contact.email}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
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
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}