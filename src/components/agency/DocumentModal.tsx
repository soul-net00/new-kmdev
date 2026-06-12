"use client";

import { useState } from "react";
import { DocumentView } from "./DocumentView";
import { SignaturePad } from "./SignaturePad";
import type { ClientDocumentType } from "@/types";

interface DocumentModalProps {
  doc: ClientDocumentType;
  onClose: () => void;
  onChanged: (doc: ClientDocumentType) => void;
}

export function DocumentModal({ doc, onClose, onChanged }: DocumentModalProps) {
  const [busy, setBusy] = useState(false);
  const [signing, setSigning] = useState(false);
  const snapshot: any = doc.snapshot || {};

  async function patch(body: any) {
    setBusy(true);
    const res = await fetch(`/api/documents/${doc._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const updated = await res.json();
    setBusy(false);
    if (res.ok) {
      onChanged(updated);
      setSigning(false);
    }
  }

  const btn = "inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="my-6 w-full max-w-3xl">
        {/* Action bar (hidden when printing) */}
        <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white p-3 shadow-lg dark:bg-slate-900">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {doc.title} · <span className="font-mono">{doc.referenceNumber}</span> ·{" "}
            <span className="uppercase text-emerald-600">{doc.status}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`${btn} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200`} onClick={() => window.print()}>Print / PDF</button>
            {doc.status === "draft" && <button className={`${btn} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`} disabled={busy} onClick={() => patch({ status: "sent" })}>Mark sent</button>}
            <button className={`${btn} bg-emerald-500 text-slate-950 hover:bg-emerald-400`} disabled={busy} onClick={() => setSigning((s) => !s)}>{signing ? "Cancel sign" : "Capture signature"}</button>
            {doc.status !== "approved" && <button className={`${btn} bg-emerald-600 text-white hover:bg-emerald-500`} disabled={busy} onClick={() => patch({ status: "approved" })}>Mark approved</button>}
            <button className={`${btn} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`} onClick={onClose}>Close</button>
          </div>
        </div>

        {signing && (
          <div className="no-print mb-3 rounded-2xl bg-white p-3 dark:bg-slate-900">
            <SignaturePad
              busy={busy}
              defaultName={snapshot.client?.clientName || ""}
              onSave={(sig) => patch({ signature: sig })}
            />
          </div>
        )}

        <DocumentView doc={doc} />
      </div>
    </div>
  );
}
