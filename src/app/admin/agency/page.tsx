"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { AgencySettingsType, PricingOption, ContractClause } from "@/types";

const field = "h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const card = "rounded-2xl border border-slate-200 p-5 dark:border-slate-800";

export default function AgencySettingsPage() {
  const [settings, setSettings] = useState<AgencySettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agency-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof AgencySettingsType>(key: K, value: AgencySettingsType[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!settings) return;
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/agency-settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings)
    });
    setBusy(false);
    if (res.ok) { setNotice("Settings saved."); setTimeout(() => setNotice(null), 2500); }
  }

  if (loading || !settings) return <p className="text-sm text-slate-500">Loading settings...</p>;

  const updateOption = (i: number, patch: Partial<PricingOption>) => {
    const pricingOptions = [...settings.pricingOptions];
    pricingOptions[i] = { ...pricingOptions[i], ...patch };
    set("pricingOptions", pricingOptions);
  };
  const updateClause = (i: number, patch: Partial<ContractClause>) => {
    const clauses = [...settings.clauses];
    clauses[i] = { ...clauses[i], ...patch };
    set("clauses", clauses);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agency Settings</h2>
          <p className="text-sm text-slate-500">Company details, pricing options, and contract templates used in generated documents.</p>
        </div>
        <Button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save settings"}</Button>
      </div>
      {notice && <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">{notice}</div>}

      {/* Company */}
      <div className={card}>
        <h3 className="mb-3 font-semibold">Company Information</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="text-xs text-slate-500">Company name</label><input className={field} value={settings.companyName} onChange={(e) => set("companyName", e.target.value)} /></div>
          <div><label className="text-xs text-slate-500">Developer name</label><input className={field} value={settings.developerName} onChange={(e) => set("developerName", e.target.value)} /></div>
          <div><label className="text-xs text-slate-500">Domain name</label><input className={field} value={settings.domain || ""} onChange={(e) => set("domain", e.target.value)} placeholder="https://kmdev.example.com" /></div>
          <div><label className="text-xs text-slate-500">Logo URL</label><input className={field} value={settings.logo || ""} onChange={(e) => set("logo", e.target.value)} placeholder="/uploads/logo.png" /></div>
          <div><label className="text-xs text-slate-500">Email</label><input className={field} value={settings.email || ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div><label className="text-xs text-slate-500">Phone</label><input className={field} value={settings.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="text-xs text-slate-500">Address</label><input className={field} value={settings.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
          <div><label className="text-xs text-slate-500">Reference prefix</label><input className={field} value={settings.referencePrefix} onChange={(e) => set("referencePrefix", e.target.value)} placeholder="KMDEV" /></div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.requireSignature} onChange={(e) => set("requireSignature", e.target.checked)} />
          Require client signature on documents
        </label>
      </div>

      {/* AI Assistant */}
      <div className={card}>
        <h3 className="mb-3 font-semibold">AI Assistant</h3>
        <p className="mb-3 text-sm text-slate-500">Control the dual-AI chatbot (Gemini primary, Grok failover). Disabling both falls back to offline answers.</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.aiGeminiEnabled !== false} onChange={(e) => set("aiGeminiEnabled", e.target.checked)} />
            Enable Gemini (primary)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.aiGrokEnabled !== false} onChange={(e) => set("aiGrokEnabled", e.target.checked)} />
            Enable Grok (failover)
          </label>
        </div>
        <label className="mt-3 block text-xs text-slate-500">Extra AI instructions (appended to the system prompt)</label>
        <textarea className={`${field} mt-1 h-24 py-2`} value={settings.aiPromptExtra || ""} onChange={(e) => set("aiPromptExtra", e.target.value)} placeholder="e.g. Always mention our 14-day support window. Prefer Next.js for web projects." />
      </div>

      {/* Pricing */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Pricing Options</h3>
          <button className="text-sm text-emerald-600 hover:underline" onClick={() => set("pricingOptions", [...settings.pricingOptions, { key: `option-${Date.now()}`, label: "New Service", amount: 0, recurring: false, description: "", enabled: true }])}>+ Add option</button>
        </div>
        <div className="space-y-3">
          {settings.pricingOptions.map((o, i) => (
            <div key={o.key} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="grid gap-2 sm:grid-cols-[2fr,1fr,auto,auto]">
                <input className={`${field} h-9`} value={o.label} onChange={(e) => updateOption(i, { label: e.target.value })} placeholder="Label" />
                <input className={`${field} h-9`} type="number" value={o.amount} onChange={(e) => updateOption(i, { amount: Number(e.target.value) })} placeholder="Amount (R)" />
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={o.recurring} onChange={(e) => updateOption(i, { recurring: e.target.checked })} />Monthly</label>
                <button className="text-sm text-rose-500" onClick={() => set("pricingOptions", settings.pricingOptions.filter((_, idx) => idx !== i))}>Remove</button>
              </div>
              <input className={`${field} mt-2 h-9`} value={o.description || ""} onChange={(e) => updateOption(i, { description: e.target.value })} placeholder="Description / notice" />
            </div>
          ))}
        </div>
      </div>

      {/* Clauses */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Contract Clauses</h3>
          <button className="text-sm text-emerald-600 hover:underline" onClick={() => set("clauses", [...settings.clauses, { key: `clause-${Date.now()}`, title: "New Clause", body: "" }])}>+ Add clause</button>
        </div>
        <div className="space-y-3">
          {settings.clauses.map((c, i) => (
            <div key={c.key} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center gap-2">
                <input className={`${field} h-9`} value={c.title} onChange={(e) => updateClause(i, { title: e.target.value })} placeholder="Clause title" />
                <button className="text-sm text-rose-500" onClick={() => set("clauses", settings.clauses.filter((_, idx) => idx !== i))}>Remove</button>
              </div>
              <textarea className={`${field} h-20 py-2`} value={c.body} onChange={(e) => updateClause(i, { body: e.target.value })} placeholder="Clause text" />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save settings"}</Button>
    </div>
  );
}
