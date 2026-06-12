"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { ClientType } from "@/types";

const emptyForm = { clientName: "", companyName: "", email: "", phone: "", address: "", notes: "" };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    const data = await fetch(`/api/clients${q ? `?search=${encodeURIComponent(q)}` : ""}`, { cache: "no-store" }).then((r) => r.json());
    setClients(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  function startEdit(client: ClientType) {
    setEditingId(client._id || null);
    setForm({
      clientName: client.clientName || "",
      companyName: client.companyName || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    const url = editingId ? `/api/clients/${editingId}` : "/api/clients";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || "Could not save client."); return; }
    resetForm();
    load(search);
  }

  async function remove(id?: string) {
    if (!id || !confirm("Delete this client and all their projects, documents and tickets?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    load(search);
  }

  const field = "h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Client Management</h2>
          <p className="text-sm text-slate-500">{clients.length} client{clients.length === 1 ? "" : "s"} · CRM, projects, documents &amp; payments</p>
        </div>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>{showForm ? "Close" : "+ Add Client"}</Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="mb-3 font-semibold">{editingId ? "Edit client" : "New client"}</h3>
          {error && <p className="mb-3 text-sm text-rose-500">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} placeholder="Client name *" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
            <input className={field} placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <input className={field} placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className={field} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className={`${field} sm:col-span-2`} placeholder="Physical address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <textarea className={`${field} sm:col-span-2 h-20 py-2`} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={save} disabled={busy}>{busy ? "Saving..." : editingId ? "Update client" : "Create client"}</Button>
            <Button variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <input className={field} placeholder="Search by name, company or email..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <p className="text-sm text-slate-500">Loading clients...</p>
      ) : clients.length === 0 ? (
        <p className="text-sm text-slate-500">No clients yet. Add your first client to get started.</p>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <div key={c._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <Link href={`/admin/clients/${c._id}`} className="min-w-0 flex-1">
                <div className="font-semibold">{c.clientName} {c.companyName && <span className="text-slate-400">· {c.companyName}</span>}</div>
                <div className="text-sm text-slate-500">{c.email}{c.phone ? ` · ${c.phone}` : ""}</div>
                <div className="text-xs text-slate-400">Added {formatDate(c.createdAt)}</div>
              </Link>
              <div className="flex gap-2">
                <Link href={`/admin/clients/${c._id}`}><Button variant="secondary">Open</Button></Link>
                <Button variant="ghost" onClick={() => startEdit(c)}>Edit</Button>
                <Button variant="ghost" className="text-rose-500" onClick={() => remove(c._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
