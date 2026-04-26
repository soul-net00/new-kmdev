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
      className="h-72 [perspective:1000px] sm:h-80 cursor-pointer"
      onClick={() => setFlipped((value) => !value)}
    >
      <div className={`relative flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 sm:p-6 active:scale-[0.98] ${flipped ? "shadow-md" : ""}`}>
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

      <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-slate-950 p-4 text-white shadow-lg dark:bg-slate-900 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Starting from</p>
          <h3 className="mt-1 text-2xl font-black sm:text-3xl">{currency(service.priceFrom)}</h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-300 sm:mt-4 sm:text-sm">
            {(service.includes || []).slice(0, 3).map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="grid gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onRequest(service);
            }}
            className="rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 sm:py-3 sm:text-sm"
          >
            Request in dashboard
          </button>
          <a 
            href={whatsappLink(whatsapp, message)} 
            target="_blank" 
            className="rounded-xl bg-[#25D366] py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#22b84a] sm:py-3 sm:text-sm"
          >
            Order via WhatsApp
          </a>
          <button 
            onClick={(event) => { event.stopPropagation(); onAddToCart(service); }} 
            className="rounded-xl border border-slate-700 py-2 text-xs transition-colors hover:border-emerald-500 hover:text-emerald-400 sm:py-3 sm:text-sm"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}