"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { currency, formatDate } from "@/lib/utils";
import type { ReceiptType } from "@/types";

function downloadReceipt(receipt: ReceiptType) {
  const blob = new Blob([receipt.html || ""], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${receipt.receiptNumber}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReceipts() {
    setLoading(true);
    const data = await fetch("/api/receipts", { cache: "no-store" }).then((res) => res.json());
    setReceipts(data);
    setLoading(false);
  }

  useEffect(() => { loadReceipts(); }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-2 text-lg font-semibold">Receipts</h2>
      <p className="mb-4 text-sm text-slate-500">Receipt history is stored here after you generate receipts from the Orders page.</p>
      {loading ? (
        <p className="text-sm text-slate-500">Loading receipts...</p>
      ) : receipts.length === 0 ? (
        <p className="text-sm text-slate-500">No receipts yet.</p>
      ) : (
        <div className="space-y-3">
          {receipts.map((receipt) => (
            <div key={receipt._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{receipt.receiptNumber}</div>
                  <div className="text-sm text-slate-500">{receipt.customerName} · {receipt.serviceName}</div>
                  <div className="mt-1 text-sm text-emerald-600">{currency(receipt.amount)}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatDate(receipt.issuedAt)}</div>
                </div>
                <Button variant="secondary" onClick={() => downloadReceipt(receipt)}>Download receipt</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
