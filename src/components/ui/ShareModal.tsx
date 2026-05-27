"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function ShareModal({ open, onClose, url, title }: ShareModalProps) {
  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Share ${title}`}>
      <div className="space-y-4">
        <p className="break-all rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">{url}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={copy}>Copy link</Button>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
