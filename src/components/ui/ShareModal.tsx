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
    await navigator.clipboard.writeText(url);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Share ${title}`}>
      <div className="space-y-4">
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-950">{url}</p>
        <div className="flex gap-3">
          <Button onClick={copy}>Copy link</Button>
          <a
            className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
            href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
            target="_blank"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
