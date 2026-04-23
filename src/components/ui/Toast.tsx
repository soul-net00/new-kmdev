"use client";

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return <div className="fixed bottom-4 right-4 rounded-xl bg-slate-950 px-4 py-3 text-sm text-white">{message}</div>;
}
