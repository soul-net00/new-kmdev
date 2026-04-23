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
        <h3 className="mb-4 text-lg font-semibold">Existing services</h3>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <div className="font-semibold">{service.name}</div>
                <div className="text-sm text-slate-500">R {service.priceFrom} · {service.active ? "Active" : "Hidden"}</div>
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
