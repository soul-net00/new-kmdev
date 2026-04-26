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
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold sm:text-base">{service.name}</h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{service.description}</p>
      <p className="mt-2 text-sm font-bold text-emerald-600">From {currency(service.priceFrom)}</p>
      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={() => onRequest(service)}
          className="w-full rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-slate-950"
        >
          Request
        </button>
        <a 
          href={whatsappLink(whatsapp, message)} 
          target="_blank" 
          className="w-full rounded-lg bg-[#25D366] py-2 text-center text-xs font-semibold text-white"
        >
          WhatsApp
        </a>
        <button 
          onClick={() => onAddToCart(service)} 
          className="w-full rounded-lg border border-slate-700 py-2 text-xs"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}