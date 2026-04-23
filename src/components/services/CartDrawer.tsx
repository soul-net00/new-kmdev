"use client";

import { currency, whatsappLink } from "@/lib/utils";
import type { ServiceType } from "@/types";

interface CartDrawerProps {
  items: ServiceType[];
  total: number;
  onRemove: (name: string) => void;
  whatsapp: string;
}

export function CartDrawer({ items, total, onRemove, whatsapp }: CartDrawerProps) {
  const message = items.length
    ? `Hi KMDev, I want these services:%0A${items.map((item) => `• ${item.name} - ${currency(item.priceFrom)}`).join("%0A")}`
    : "Hi KMDev";

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-slate-500">Your cart is empty.</p>}
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-emerald-600">{currency(item.priceFrom)}</div>
            </div>
            <button onClick={() => onRemove(item.name)} className="text-sm text-red-500">Remove</button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>Total</span>
        <strong>{currency(total)}</strong>
      </div>
      <a href={whatsappLink(whatsapp, decodeURIComponent(message))} target="_blank" className="block rounded-xl bg-[#25D366] px-4 py-3 text-center font-semibold text-white">Order cart on WhatsApp</a>
    </div>
  );
}
