"use client";

import { useState } from "react";
import type { ServiceType } from "@/types";
import { currency, whatsappLink } from "@/lib/utils";
import { PreviewableImage } from "@/components/ui/PreviewableImage";

interface ServiceCardProps {
  service: ServiceType;
  onAddToCart: (service: ServiceType) => void;
  onRequest: (service: ServiceType) => void;
  whatsapp: string;
}

export function ServiceCard({ service, onAddToCart, onRequest, whatsapp }: ServiceCardProps) {
  const [flipped, setFlipped] = useState(false);
  const message = `Hi KMDev, I am interested in ${service.name} from ${currency(service.priceFrom)}.`;

  return (
    <div 
      className="min-h-[320px] sm:min-h-[280px] cursor-pointer"
      onClick={() => setFlipped((value) => !value)}
    >
      <div className={`relative flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6`}>
        <div className="flex-1">
          <div className="mb-3 sm:mb-4">
            <PreviewableImage
              src={service.image || ""}
              alt={service.name}
              className="h-20 w-full rounded-lg sm:h-24"
              fallbackEmoji="🛠️"
              showSparkle={false}
            />
          </div>
          <h3 className="text-base font-semibold sm:text-xl">{service.name}</h3>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 sm:text-sm">{service.description}</p>
        </div>
        <p className="text-xs font-semibold text-emerald-600 sm:text-sm">Tap to view pricing</p>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-slate-950 p-4 text-white shadow-lg dark:bg-slate-900 overflow-y-auto sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Starting from</p>
          <h3 className="mt-1 text-2xl font-black sm:text-3xl">{currency(service.priceFrom)}</h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-300 sm:mt-4 sm:text-sm">
            {(service.includes || []).slice(0, 3).map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onRequest(service);
            }}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Request in dashboard
          </button>
          <a 
            href={whatsappLink(whatsapp, message)} 
            target="_blank" 
            className="w-full rounded-xl bg-[#25D366] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#22b84a]"
          >
            Order via WhatsApp
          </a>
          <button 
            onClick={(event) => { event.stopPropagation(); onAddToCart(service); }} 
            className="w-full rounded-xl border border-slate-700 py-3 text-sm transition-colors hover:border-emerald-500 hover:text-emerald-400"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}