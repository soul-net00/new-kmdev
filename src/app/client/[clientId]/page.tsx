"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { currency, formatDate } from "@/lib/utils";
import { computePayments } from "@/lib/agency-constants";
import { DocumentView } from "@/components/agency/DocumentView";
import { SignaturePad } from "@/components/agency/SignaturePad";
import type { ClientProjectType, ClientDocumentType, SupportTicketType } from "@/types";

interface PortalData {
  client: { clientName: string; companyName?: string; email: string };
  projects: ClientProjectType[];
  documents: ClientDocumentType[];
  tickets: SupportTicketType[];
}

export default function ClientPortalPage() {
  const params = useParams<{ clientId: string }>();
  const clientId = params.clientId;

  const [password, setPassword] = useState("");
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [viewDoc, setViewDoc] = useState<ClientDocumentType | null>(null);
  const [signing, setSigning] = useState(false);
  const [ticket, setTicket] = useState({ subject: "", message: "" });

  async function call(body: any) {
    const res = await fetch(`/api/portal/${clientId}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, ...body })
    });
    return { ok: res.ok, data: await res.json() };
  }

  async function unlock() {
    setBusy(true);
    setError(null);
    const { ok, data: d } = await call({ action: "unlock" });
    setBusy(false);
    if (!ok) { setError(d.error || "Access denied."); return; }
    setData(d);
  }

  async function refresh() {
    const { ok, data: d } = await call({ action: "unlock" });
    if (ok) setData(d);
  }

  async function signDoc(sig: { method: "draw" | "type" | "upload"; data: string; signedBy: string }) {
    if (!viewDoc) return;
    setBusy(true);
    const { ok } = await call({ action: "sign", documentId: viewDoc._id, signature: sig });
    setBusy(false);
    if (ok) { setSigning(false); setViewDoc(null); refresh(); }
  }

  async function approveDoc(id?: string) {
    if (!id) return;
    await call({ action: "approve", documentId: id });
    setViewDoc(null);
    refresh();
  }

  async function submitTicket() {
    if (!ticket.subject.trim() || !ticket.message.trim()) return;
    const { ok } = await call({ action: "ticket", subject: ticket.subject, message: ticket.message });
    if (ok) { setTicket({ subject: "", message: "" }); refresh(); }
  }

  // ── Password gate ────────────────────────────────────────
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-100">
          <div className="mb-6 text-center">
            <div className="font-mono text-lg font-bold text-emerald-400">KMDev</div>
            <div className="text-sm text-slate-400">Client Portal</div>
          </div>
          <label className="text-sm text-slate-400">Enter your project password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-white focus:border-emerald-500 focus:outline-none"
            placeholder="Password"
          />
          {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
          <button onClick={unlock} disabled={busy} className="mt-4 h-11 w-full rounded-xl bg-emerald-500 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
            {busy ? "Checking..." : "Access Portal"}
          </button>
        </div>
      </div>
    );
  }

  // ── Portal ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {data.client.clientName}</h1>
            <p className="text-sm text-slate-400">{data.client.companyName || data.client.email}</p>
          </div>
          <div className="font-mono text-sm font-bold text-emerald-400">KMDev</div>
        </div>

        {/* Projects */}
        {data.projects.map((p) => {
          const pay = computePayments(p.payments || []);
          return (
            <div key={p._id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{p.projectName}</h2>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase text-emerald-400">{p.status}</span>
              </div>
              {p.description && <p className="mt-1 text-sm text-slate-400">{p.description}</p>}
              <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-xl bg-slate-800 p-3"><div className="text-xs text-slate-400">Value</div><div className="font-bold">{currency(p.projectValue || 0)}</div></div>
                <div className="rounded-xl bg-slate-800 p-3"><div className="text-xs text-slate-400">Paid</div><div className="font-bold text-emerald-400">{currency(pay.paid)}</div></div>
                <div className="rounded-xl bg-slate-800 p-3"><div className="text-xs text-slate-400">Outstanding</div><div className="font-bold text-amber-400">{currency(pay.outstanding)}</div></div>
              </div>
            </div>
          );
        })}

        {/* Documents */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-3 text-lg font-semibold">Your Documents</h2>
          {data.documents.length === 0 ? (
            <p className="text-sm text-slate-400">No documents yet.</p>
          ) : (
            <div className="space-y-2">
              {data.documents.map((d) => (
                <div key={d._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 p-3">
                  <div>
                    <div className="font-medium">{d.title} <span className="font-mono text-xs text-slate-500">{d.referenceNumber}</span></div>
                    <div className="text-xs"><span className="uppercase text-emerald-400">{d.status}</span> · {formatDate(d.generatedAt)}</div>
                  </div>
                  <button onClick={() => { setViewDoc(d); setSigning(false); }} className="rounded-xl border border-slate-700 px-4 py-1.5 text-sm font-semibold hover:bg-slate-800">View</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tickets */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-3 text-lg font-semibold">Support</h2>
          <div className="space-y-2">
            <input className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm" placeholder="Subject" value={ticket.subject} onChange={(e) => setTicket({ ...ticket, subject: e.target.value })} />
            <textarea className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm" placeholder="Describe your request, bug, or change..." rows={3} value={ticket.message} onChange={(e) => setTicket({ ...ticket, message: e.target.value })} />
            <button onClick={submitTicket} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Submit ticket</button>
          </div>
          {data.tickets.length > 0 && (
            <div className="mt-4 space-y-2">
              {data.tickets.map((t) => (
                <div key={t._id} className="rounded-xl border border-slate-800 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{t.subject}</div>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs uppercase">{t.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{t.message}</p>
                  {(t.responses || []).map((r, i) => (
                    <div key={i} className={`mt-2 rounded-lg p-2 text-sm ${r.author === "admin" ? "bg-emerald-500/10" : "bg-slate-800"}`}>
                      <span className="text-xs font-semibold uppercase text-slate-500">{r.author}</span>
                      <p>{r.message}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document viewer */}
      {viewDoc && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="my-6 w-full max-w-3xl">
            <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-900 p-3">
              <div className="text-sm font-semibold">{viewDoc.title} · <span className="font-mono">{viewDoc.referenceNumber}</span></div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold" onClick={() => window.print()}>Print / PDF</button>
                {!viewDoc.signature?.signedAt && <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950" onClick={() => setSigning((s) => !s)}>{signing ? "Cancel" : "Sign"}</button>}
                {viewDoc.status !== "approved" && <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => approveDoc(viewDoc._id)}>Approve</button>}
                <button className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold" onClick={() => { setViewDoc(null); setSigning(false); }}>Close</button>
              </div>
            </div>
            {signing && (
              <div className="no-print mb-3 rounded-2xl bg-white p-3">
                <SignaturePad busy={busy} defaultName={data.client.clientName} onSave={signDoc} />
              </div>
            )}
            <DocumentView doc={viewDoc} />
          </div>
        </div>
      )}
    </div>
  );
}
