"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDate, whatsappLink } from "@/lib/utils";
import type { QuoteRequestType } from "@/types";

interface ApprovalResult {
  clientId: string;
  projectId: string;
  referenceNumber: string;
}

export default function AdminQuotesPage() {
  const [requests, setRequests] = useState<QuoteRequestType[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<QuoteRequestType | null>(null);
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState("");
  const [approval, setApproval] = useState<ApprovalResult | null>(null);
  const [origin, setOrigin] = useState("");
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => setOrigin(window.location.origin), []);

  const load = useCallback(async () => {
    setLoading(true);
    const q = filter === "all" ? "" : `?status=${filter}`;
    const [reqs, convs] = await Promise.all([
      fetch(`/api/quote-requests${q}`, { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/chat-conversations?limit=20", { cache: "no-store" }).then((r) => r.json())
    ]);
    setRequests(Array.isArray(reqs) ? reqs : []);
    setConversations(Array.isArray(convs) ? convs : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  function open(req: QuoteRequestType) {
    setActive(req);
    setNotes(req.adminNotes || "");
    setEstimate(req.estimateText || "");
    setApproval(null);
  }

  async function act(action: string, extra: any = {}) {
    if (!active?._id) return;
    setBusy(true);
    const res = await fetch(`/api/quote-requests/${active._id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...extra })
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      if (action === "approve") setApproval({ clientId: data.clientId, projectId: data.projectId, referenceNumber: data.referenceNumber });
      await load();
      if (action !== "approve") setActive(null);
      else setActive((prev) => (prev ? { ...prev, status: "approved" } as QuoteRequestType : prev));
    }
  }

  const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quote Requests</h2>
        <p className="text-sm text-slate-500">AI-collected project requests awaiting developer review.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === f ? "bg-emerald-500 text-slate-950" : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-slate-500">No {filter === "all" ? "" : filter} quote requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <div className="font-semibold">{r.contact.name} {r.contact.company && <span className="text-slate-400">· {r.contact.company}</span>}</div>
                <div className="text-sm text-slate-500">{r.contact.email}{r.contact.phone ? ` · ${r.contact.phone}` : ""}</div>
                <div className="mt-1 text-xs">
                  <span className={`uppercase ${r.status === "pending" ? "text-amber-600" : r.status === "approved" ? "text-emerald-600" : "text-rose-500"}`}>{r.status}</span>
                  <span className="text-slate-400"> · {formatDate(r.createdAt)}</span>
                </div>
              </div>
              <Button variant="secondary" onClick={() => open(r)}>Review</Button>
            </div>
          ))}
        </div>
      )}

      {/* Recent AI conversations */}
      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h3 className="mb-3 font-semibold">Recent AI Conversations</h3>
        {conversations.length === 0 ? (
          <p className="text-sm text-slate-500">No conversations recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {conversations.slice(0, 10).map((c) => (
              <details key={c._id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <summary className="cursor-pointer text-sm font-medium">
                  {c.messages?.[c.messages.length - 1]?.content?.slice(0, 70) || "Conversation"}… <span className="text-xs text-slate-400">({c.messages?.length || 0} messages · {formatDate(c.updatedAt)})</span>
                </summary>
                <div className="mt-2 space-y-1">
                  {(c.messages || []).map((m: any, i: number) => (
                    <div key={i} className={`text-xs ${m.role === "user" ? "text-slate-700 dark:text-slate-200" : "text-emerald-600 dark:text-emerald-300"}`}>
                      <span className="font-semibold">{m.role === "user" ? "User" : `AI${m.provider ? ` (${m.provider})` : ""}`}:</span> {m.content}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Review modal */}
      {active && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="my-6 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{active.contact.name}</h3>
              <button onClick={() => setActive(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>
            <p className="text-sm text-slate-500">{active.contact.email}{active.contact.phone ? ` · ${active.contact.phone}` : ""}{active.contact.company ? ` · ${active.contact.company}` : ""}</p>

            {active.transcript?.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                {active.transcript.map((m, i) => (
                  <div key={i} className={`mb-1 ${m.role === "user" ? "text-slate-700 dark:text-slate-200" : "text-emerald-600 dark:text-emerald-300"}`}>
                    <span className="font-semibold">{m.role === "user" ? "Client" : "AI"}:</span> {m.content}
                  </div>
                ))}
              </div>
            )}

            <label className="mt-4 block text-xs text-slate-500">AI estimate / summary (editable)</label>
            <textarea className={`${field} mt-1 h-24`} value={estimate} onChange={(e) => setEstimate(e.target.value)} />
            <label className="mt-3 block text-xs text-slate-500">Developer notes</label>
            <textarea className={`${field} mt-1 h-20`} value={notes} onChange={(e) => setNotes(e.target.value)} />

            {approval ? (
              <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Approved · Reference {approval.referenceNumber}</p>
                <p className="mt-1 text-xs text-slate-500">Client &amp; project created with an AI-draft quotation (pending your approval in the workspace).</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/admin/clients/${approval.clientId}`}><Button variant="secondary">Open client workspace</Button></Link>
                  <a href={whatsappLink(active.contact.phone || "", `Hi ${active.contact.name}, your KMDev quote has been approved. Reference: ${approval.referenceNumber}. View it in your client portal: ${origin}/client/${approval.clientId}`)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white">Notify via WhatsApp</a>
                  <a href={`mailto:${active.contact.email}?subject=${encodeURIComponent(`Your KMDev quote ${approval.referenceNumber} is approved`)}&body=${encodeURIComponent(`Hi ${active.contact.name},\n\nYour quote has been approved.\nReference: ${approval.referenceNumber}\nClient portal: ${origin}/client/${approval.clientId}\nVerify: ${origin}/verify/${approval.referenceNumber}\n\nKMDev`)}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold dark:border-slate-700">Notify via Email</a>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button disabled={busy} onClick={() => act("approve")}>Approve</Button>
                <Button variant="secondary" disabled={busy} onClick={() => act("modify", { adminNotes: notes, estimateText: estimate })}>Save changes</Button>
                <Button variant="ghost" className="text-rose-500" disabled={busy} onClick={() => act("reject", { adminNotes: notes })}>Reject</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
