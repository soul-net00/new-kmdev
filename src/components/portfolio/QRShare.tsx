"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const DEFAULT_URL = "http://localhost:3001";

export function QRShare() {
  const [url] = useState(DEFAULT_URL);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:rounded-3xl md:p-8 md:grid-cols-[1fr,280px]">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Share</p>
          <h2 className="text-xl font-bold md:text-3xl">Share my portfolio</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 md:mt-4">Use the QR code or copy the live link for WhatsApp and quick sharing.</p>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 md:rounded-2xl md:p-6">
          <QRCodeSVG value={url} size={120} bgColor="transparent" fgColor="#16a34a" className="md:w-40 md:h-40" />
          <button onClick={handleCopy} className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700 w-full md:w-auto">
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </section>
  );
}
