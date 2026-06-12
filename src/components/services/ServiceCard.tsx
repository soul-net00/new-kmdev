"use client";

import type { ServiceType } from "@/types";
import { currency, whatsappLink } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceType;
  onAddToCart: (service: ServiceType) => void;
  onRequest: (service: ServiceType) => void;
  whatsapp: string;
}

export function ServiceCard({ service, onAddToCart, onRequest, whatsapp }: ServiceCardProps) {
  const message = `Hi KMDev, I am interested in ${service.name} from ${currency(service.priceFrom)}.`;

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/85 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_0_32px_rgba(16,185,129,0.18)] dark:bg-slate-900/80 sm:p-5">
      <h3 className="text-base font-semibold leading-tight sm:text-lg">{service.name}</h3>
      <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
      <p className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-300">From {currency(service.priceFrom)}</p>
      <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
        <button
          onClick={() => onRequest(service)}
          className="min-h-11 w-full rounded-xl bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Request
        </button>
        <a 
          href={whatsappLink(whatsapp, message)} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#25D366] px-3 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          WhatsApp
        </a>
        <button 
          onClick={() => onAddToCart(service)} 
          className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold transition hover:border-emerald-400 hover:bg-emerald-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:border-slate-700 sm:col-span-2"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
