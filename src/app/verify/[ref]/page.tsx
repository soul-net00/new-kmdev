"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface VerifyResult {
  valid: boolean;
  referenceNumber?: string;
  documentTitle?: string;
  clientName?: string;
  companyName?: string;
  projectName?: string;
  generatedAt?: string;
  status?: string;
  approved?: boolean;
  approvedAt?: string | null;
  signed?: boolean;
  signedBy?: string;
  signedAt?: string | null;
  paymentStatus?: string;
}

export default function VerifyPage() {
  const params = useParams<{ ref: string }>();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify/${params.ref}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setResult(data))
      .catch(() => setResult({ valid: false }))
      .finally(() => setLoading(false));
  }, [params.ref]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="font-mono text-lg font-bold text-emerald-400">KMDev</div>
          <div className="text-sm text-slate-400">Document Verification</div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Verifying...</p>
        ) : !result?.valid ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-3xl text-rose-400">✕</div>
            <h1 className="text-xl font-bold text-rose-400">Invalid Document</h1>
            <p className="mt-2 text-sm text-slate-400">
              No document was found with reference{" "}
              <span className="font-mono text-slate-200">{result?.referenceNumber || params.ref}</span>. This document could not be verified as authentic.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-400">✓</div>
              <h1 className="text-xl font-bold text-emerald-400">Valid Document</h1>
              <p className="mt-1 font-mono text-sm text-slate-300">{result.referenceNumber}</p>
            </div>

            <dl className="mt-6 space-y-3">
              <Field label="Document" value={result.documentTitle} />
              <Field label="Client" value={result.clientName} />
              {result.companyName && <Field label="Company" value={result.companyName} />}
              <Field label="Project" value={result.projectName} />
              <Field label="Generated" value={result.generatedAt ? formatDate(result.generatedAt) : "—"} />
              <Field label="Status" value={<span className="uppercase text-emerald-400">{result.status}</span>} />
              <Field label="Approved" value={result.approved ? `Yes${result.approvedAt ? ` · ${formatDate(result.approvedAt)}` : ""}` : "No"} />
              <Field label="Signature" value={result.signed ? `Received${result.signedBy ? ` · ${result.signedBy}` : ""}` : "Not signed"} />
              <Field label="Payment" value={result.paymentStatus} />
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}
