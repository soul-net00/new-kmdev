"use client";

import type { PropsWithChildren } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({ open, onClose, title, children }: PropsWithChildren<ModalProps>) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-slate-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
