"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminImageInput } from "@/components/admin/AdminImageInput";
import type { ServiceType } from "@/types";

const emptyForm: ServiceType = {
  name: "",
  description: "",
  priceFrom: 0,
  active: true,
  image: "",
  includes: []
};

export function ServiceEditor() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [form, setForm] = useState<ServiceType>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadServices() {
    const data = await fetch("/api/services").then((res) => res.json());
    setServices(data);
  }

  useEffect(() => { loadServices(); }, []);

  async function submit() {
    const response = await fetch(editingId ? `/api/services/${editingId}` : "/api/services", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      await loadServices();
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    await loadServices();
  }

  async function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected service(s)?`)) return;
    
    setDeleting(true);
    for (const id of selectedIds) {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
    }
    setSelectedIds(new Set());
    setSelectAll(false);
    await loadServices();
    setDeleting(false);
  }

  function toggleSelect(id: string) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(services.map((s) => s._id || "")));
    }
    setSelectAll(!selectAll);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">Service editor</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Service name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Starting price</span><input type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <div className="md:col-span-2"><label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label></div>
          <div className="md:col-span-2">
            <AdminImageInput
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
              label="Image"
            />
          </div>
          <label><span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Includes (comma separated)</span><input value={(form.includes || []).join(", ")} onChange={(e) => setForm({ ...form, includes: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700"><input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={submit}>{editingId ? "Update service" : "Create service"}</Button>
          {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</Button>}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Existing services ({services.length})</h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="rounded" />
              Select all
            </label>
            {selectedIds.size > 0 && (
              <Button variant="ghost" className="text-red-500" onClick={deleteSelected} disabled={deleting}>
                Delete {selectedIds.size} selected
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service._id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 dark:border-slate-800 ${selectedIds.has(service._id || "") ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(service._id || "")}
                  onChange={() => toggleSelect(service._id || "")}
                  className="rounded"
                />
                <div>
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-slate-500">R {service.priceFrom} · {service.active ? "Active" : "Hidden"}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setEditingId(service._id || null); setForm({ ...service, includes: service.includes || [] }); }}>Edit</Button>
                <Button variant="ghost" className="text-red-500" onClick={() => remove(service._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}