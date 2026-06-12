"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { currency, formatDate } from "@/lib/utils";
import { WORKFLOW_STAGES, DOCUMENT_TYPES, computePricing, computePayments } from "@/lib/agency-constants";
import { DocumentModal } from "@/components/agency/DocumentModal";
import { SignaturePreview } from "@/components/agency/SignaturePad";
import type { ClientType, ClientProjectType, ClientDocumentType, SupportTicketType } from "@/types";

const field = "h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const card = "rounded-2xl border border-slate-200 p-5 dark:border-slate-800";

export default function ClientWorkspacePage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;

  const [client, setClient] = useState<ClientType | null>(null);
  const [projects, setProjects] = useState<ClientProjectType[]>([]);
  const [documents, setDocuments] = useState<ClientDocumentType[]>([]);
  const [tickets, setTickets] = useState<SupportTicketType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewDoc, setViewDoc] = useState<ClientDocumentType | null>(null);
  const [newProject, setNewProject] = useState({ projectName: "", description: "", category: "Web", projectValue: 0 });
  const [showNewProject, setShowNewProject] = useState(false);
  const [portalPw, setPortalPw] = useState("");
  const [origin, setOrigin] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetch(`/api/clients/${clientId}`, { cache: "no-store" }).then((r) => r.json());
    if (data.client) {
      setClient(data.client);
      setProjects(data.projects || []);
      setDocuments(data.documents || []);
      setTickets(data.tickets || []);
      setActiveId((prev) => prev || (data.projects?.[0]?._id ?? null));
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  const active = projects.find((p) => p._id === activeId) || null;
  const activeDocs = documents.filter((d) => d.projectId === activeId);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  }

  async function patchProject(id: string, body: any) {
    const res = await fetch(`/api/client-projects/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    const updated = await res.json();
    if (res.ok) {
      setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return updated;
    }
    return null;
  }

  // local edits to the active project (pricing/payments/handover)
  function updateActive(patch: Partial<ClientProjectType>) {
    if (!active) return;
    setProjects((prev) => prev.map((p) => (p._id === active._id ? { ...p, ...patch } : p)));
  }

  async function createProject() {
    if (!newProject.projectName.trim()) return;
    const res = await fetch("/api/client-projects", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProject, clientId })
    });
    const created = await res.json();
    if (res.ok) {
      setProjects((prev) => [created, ...prev]);
      setActiveId(created._id);
      setShowNewProject(false);
      setNewProject({ projectName: "", description: "", category: "Web", projectValue: 0 });
      flash("Project created.");
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project and its documents?")) return;
    await fetch(`/api/client-projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p._id !== id));
    setActiveId(null);
    load();
  }

  async function generateDocument(type: string) {
    if (!active) return;
    const res = await fetch("/api/documents", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: active._id, type })
    });
    const doc = await res.json();
    if (res.ok) {
      setDocuments((prev) => [doc, ...prev]);
      flash(`Generated ${doc.title} (${doc.referenceNumber}).`);
      setViewDoc(doc);
    }
  }

  async function deleteDocument(id?: string) {
    if (!id || !confirm("Delete this document?")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  }

  async function replyTicket(id: string | undefined, reply: string, status?: string) {
    if (!id) return;
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reply, status })
    });
    const updated = await res.json();
    if (res.ok) setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  if (loading) return <p className="text-sm text-slate-500">Loading workspace...</p>;
  if (!client) return <p className="text-sm text-slate-500">Client not found. <Link href="/admin/clients" className="text-emerald-600 underline">Back to clients</Link></p>;

  const pricing = active ? computePricing(active) : null;
  const payments = active ? computePayments(active.payments || []) : null;

  return (
    <div className="space-y-6">
      {notice && <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">{notice}</div>}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/clients" className="text-sm text-emerald-600 hover:underline">← All clients</Link>
          <h2 className="mt-1 text-2xl font-bold">{client.clientName}</h2>
          <p className="text-sm text-slate-500">{client.companyName ? `${client.companyName} · ` : ""}{client.email}{client.phone ? ` · ${client.phone}` : ""}</p>
          {client.address && <p className="text-sm text-slate-400">{client.address}</p>}
        </div>
        <Link href={`/client/${clientId}`} target="_blank">
          <Button variant="secondary">Open client portal ↗</Button>
        </Link>
      </div>

      {/* Project tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {projects.map((p) => (
          <button
            key={p._id}
            onClick={() => setActiveId(p._id || null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeId === p._id ? "bg-emerald-500 text-slate-950" : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {p.projectName}
          </button>
        ))}
        <Button variant="ghost" onClick={() => setShowNewProject((s) => !s)}>+ New project</Button>
      </div>

      {showNewProject && (
        <div className={`${card} bg-slate-50 dark:bg-slate-900/50`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} placeholder="Project name *" value={newProject.projectName} onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })} />
            <select className={field} value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}>
              {["Web", "Desktop", "Database", "Mobile", "Other"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className={field} type="number" placeholder="Project value (R)" value={newProject.projectValue || ""} onChange={(e) => setNewProject({ ...newProject, projectValue: Number(e.target.value) })} />
            <input className={field} placeholder="Short description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
          </div>
          <div className="mt-3"><Button onClick={createProject}>Create project</Button></div>
        </div>
      )}

      {!active ? (
        <p className="text-sm text-slate-500">No project selected. Create a project to manage its workflow, pricing, documents and payments.</p>
      ) : (
        <div className="space-y-6">
          {/* Workflow */}
          <div className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Project Workflow</h3>
              <button className="text-xs text-rose-500 hover:underline" onClick={() => deleteProject(active._id!)}>Delete project</button>
            </div>
            <select
              className={field}
              value={active.status}
              onChange={(e) => patchProject(active._id!, { status: e.target.value }).then(() => flash("Stage updated."))}
            >
              {WORKFLOW_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {WORKFLOW_STAGES.map((s, i) => {
                const currentIdx = WORKFLOW_STAGES.indexOf(active.status as any);
                const done = i <= currentIdx;
                return (
                  <span key={s} className={`h-1.5 flex-1 min-w-[10px] rounded-full ${done ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} title={s} />
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">Stage {WORKFLOW_STAGES.indexOf(active.status as any) + 1} of {WORKFLOW_STAGES.length}: {active.status}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pricing builder */}
            <div className={card}>
              <h3 className="mb-3 font-semibold">Pricing Builder</h3>
              <label className="text-xs text-slate-500">Base project price (R)</label>
              <input
                className={`${field} mb-3`}
                type="number"
                value={active.basePrice || 0}
                onChange={(e) => updateActive({ basePrice: Number(e.target.value) })}
              />
              <div className="space-y-2">
                {(active.extras || []).map((ex, idx) => (
                  <div key={ex.key} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={ex.enabled}
                        onChange={(e) => {
                          const extras = [...active.extras];
                          extras[idx] = { ...ex, enabled: e.target.checked };
                          updateActive({ extras });
                        }}
                      />
                      <span className="font-medium">{ex.label}</span>
                      {ex.recurring && <span className="rounded bg-emerald-500/10 px-1.5 text-xs text-emerald-600">monthly</span>}
                    </label>
                    {ex.enabled && (
                      <input
                        className={`${field} mt-2 h-9`}
                        type="number"
                        value={ex.amount || 0}
                        onChange={(e) => {
                          const extras = [...active.extras];
                          extras[idx] = { ...ex, amount: Number(e.target.value) };
                          updateActive({ extras });
                        }}
                      />
                    )}
                    {ex.key === "ai-chatbot" && ex.enabled && (
                      <p className="mt-2 text-xs text-amber-600">AI chatbot functionality requires third-party AI APIs. API usage costs are billed separately according to the provider&apos;s pricing.</p>
                    )}
                  </div>
                ))}
              </div>
              {pricing && (
                <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500">Base</span><span>{currency(pricing.base)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">One-off extras</span><span>{currency(pricing.oneOffExtras)}</span></div>
                  <div className="flex justify-between font-bold text-emerald-600"><span>Total (one-off)</span><span>{currency(pricing.total)}</span></div>
                  {pricing.monthly > 0 && <div className="flex justify-between"><span className="text-slate-500">Monthly services</span><span>{currency(pricing.monthly)}/mo</span></div>}
                </div>
              )}
              <Button className="mt-3" onClick={() => patchProject(active._id!, { basePrice: active.basePrice, extras: active.extras }).then(() => flash("Pricing saved."))}>Save pricing</Button>
            </div>

            {/* Payments */}
            <div className={card}>
              <h3 className="mb-3 font-semibold">Payment Tracking</h3>
              <div className="space-y-2">
                {(active.payments || []).map((p, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                    <input
                      className={`${field} h-9 flex-1`}
                      value={p.label}
                      onChange={(e) => { const payments = [...active.payments]; payments[idx] = { ...p, label: e.target.value }; updateActive({ payments }); }}
                    />
                    <input
                      className={`${field} h-9 w-28`}
                      type="number"
                      value={p.amount || 0}
                      onChange={(e) => { const payments = [...active.payments]; payments[idx] = { ...p, amount: Number(e.target.value) }; updateActive({ payments }); }}
                    />
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={p.paid} onChange={(e) => { const payments = [...active.payments]; payments[idx] = { ...p, paid: e.target.checked }; updateActive({ payments }); }} />
                      Paid
                    </label>
                    <button className="text-xs text-rose-500" onClick={() => { const payments = active.payments.filter((_, i) => i !== idx); updateActive({ payments }); }}>✕</button>
                  </div>
                ))}
              </div>
              <button className="mt-2 text-sm text-emerald-600 hover:underline" onClick={() => updateActive({ payments: [...(active.payments || []), { label: "Payment", amount: 0, paid: false }] })}>+ Add payment</button>
              {payments && (
                <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500">Project value</span><span>{currency(active.projectValue || 0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total paid</span><span className="text-emerald-600">{currency(payments.paid)}</span></div>
                  <div className="flex justify-between font-bold"><span>Outstanding</span><span className="text-amber-600">{currency(payments.outstanding)}</span></div>
                </div>
              )}
              <Button className="mt-3" onClick={() => patchProject(active._id!, { payments: active.payments }).then(() => flash("Payments saved."))}>Save payments</Button>
            </div>

            {/* Handover */}
            <div className={card}>
              <h3 className="mb-3 font-semibold">Handover Checklist</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(active.handover || []).map((h, idx) => (
                  <label key={h.key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={h.done} onChange={(e) => { const handover = [...active.handover]; handover[idx] = { ...h, done: e.target.checked }; updateActive({ handover }); }} />
                    {h.label}
                  </label>
                ))}
              </div>
              <Button className="mt-3" onClick={() => patchProject(active._id!, { handover: active.handover }).then(() => flash("Handover saved."))}>Save handover</Button>
            </div>

            {/* Portal access */}
            <div className={card}>
              <h3 className="mb-3 font-semibold">Client Portal Access</h3>
              <p className="mb-2 break-all text-xs text-slate-500">{origin}/client/{clientId}</p>
              <button className="mb-3 text-sm text-emerald-600 hover:underline" onClick={() => { navigator.clipboard.writeText(`${origin}/client/${clientId}`); flash("Portal link copied."); }}>Copy portal link</button>
              <label className="text-xs text-slate-500">Set / change portal password</label>
              <input className={`${field} mb-3`} type="text" placeholder="New password" value={portalPw} onChange={(e) => setPortalPw(e.target.value)} />
              <Button onClick={() => patchProject(active._id!, { portalPassword: portalPw }).then(() => { setPortalPw(""); flash("Portal password set."); })}>Save password</Button>
            </div>
          </div>

          {/* Documents */}
          <div className={card}>
            <h3 className="mb-3 font-semibold">Documents</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {DOCUMENT_TYPES.map((d) => (
                <button key={d.key} onClick={() => generateDocument(d.key)} className="rounded-full border border-emerald-400/40 px-3 py-1.5 text-xs font-medium text-emerald-600 transition hover:bg-emerald-400 hover:text-slate-950 dark:text-emerald-300" title={d.description}>
                  + {d.title}
                </button>
              ))}
            </div>
            {activeDocs.length === 0 ? (
              <p className="text-sm text-slate-500">No documents yet. Generate one above.</p>
            ) : (
              <div className="space-y-2">
                {activeDocs.map((d) => (
                  <div key={d._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <div>
                      <div className="font-medium">{d.title} <span className="font-mono text-xs text-slate-400">{d.referenceNumber}</span></div>
                      <div className="text-xs text-slate-500">
                        <span className="uppercase text-emerald-600">{d.status}</span> · {formatDate(d.generatedAt)}
                        {d.signature?.signedAt && " · signed"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setViewDoc(d)}>View</Button>
                      <Button variant="ghost" className="text-rose-500" onClick={() => deleteDocument(d._id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tickets */}
      <div className={card}>
        <h3 className="mb-3 font-semibold">Support Tickets</h3>
        {tickets.length === 0 ? (
          <p className="text-sm text-slate-500">No tickets from this client.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <TicketRow key={t._id} ticket={t} onReply={replyTicket} />
            ))}
          </div>
        )}
      </div>

      {viewDoc && (
        <DocumentModal
          doc={viewDoc}
          onClose={() => setViewDoc(null)}
          onChanged={(updated) => { setDocuments((prev) => prev.map((d) => (d._id === updated._id ? updated : d))); setViewDoc(updated); }}
        />
      )}
    </div>
  );
}

function TicketRow({ ticket, onReply }: { ticket: SupportTicketType; onReply: (id: string | undefined, reply: string, status?: string) => void }) {
  const [reply, setReply] = useState("");
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div className="font-medium">{ticket.subject}</div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs uppercase dark:bg-slate-800">{ticket.status}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ticket.message}</p>
      {(ticket.responses || []).map((r, i) => (
        <div key={i} className={`mt-2 rounded-lg p-2 text-sm ${r.author === "admin" ? "bg-emerald-500/10" : "bg-slate-100 dark:bg-slate-800"}`}>
          <span className="text-xs font-semibold uppercase text-slate-400">{r.author}</span>
          <p>{r.message}</p>
        </div>
      ))}
      <div className="mt-2 flex gap-2">
        <input className="h-9 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Reply..." value={reply} onChange={(e) => setReply(e.target.value)} />
        <button className="rounded-xl bg-emerald-500 px-3 text-sm font-semibold text-slate-950" onClick={() => { if (reply.trim()) { onReply(ticket._id, reply); setReply(""); } }}>Send</button>
        <select className="rounded-xl border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-800" value={ticket.status} onChange={(e) => onReply(ticket._id, "", e.target.value)}>
          {["open", "in-progress", "resolved", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
