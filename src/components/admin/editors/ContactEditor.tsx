"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ContactForm {
  email: string;
  whatsapp: string;
}

const defaultContact: ContactForm = {
  email: "kgomotsothabo2004@gmail.com",
  whatsapp: "27601603996"
};

export function ContactEditor() {
  const [form, setForm] = useState<ContactForm>(defaultContact);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/site-settings").then((res) => res.json()).then((data) => {
      if (data?.contact) {
        setForm({
          email: data.contact.email || "",
          whatsapp: data.contact.whatsapp || ""
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
      body: JSON.stringify({ ...settings, contact: form })
    });
    setSaving(false);
    setMessage(response.ok ? "Contact updated." : "Failed to update contact details.");
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold">Contact section</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Email</span>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">WhatsApp (without +)</span>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            placeholder="27601603996"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save contact"}</Button>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </div>
  );
}
