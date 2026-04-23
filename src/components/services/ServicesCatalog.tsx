"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/services/CartDrawer";
import { OrderRequestModal } from "@/components/services/OrderRequestModal";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { ServiceType } from "@/types";

export function ServicesCatalog({ services, whatsapp }: { services: ServiceType[]; whatsapp: string }) {
  const { items, total, addItem, removeItem } = useCart();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[1fr,320px]">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard
              key={service._id || service.name}
              service={service}
              onAddToCart={addItem}
              onRequest={setSelectedService}
              whatsapp={whatsapp}
            />
          ))}
        </div>
        <div className="hidden xl:block">
          <aside className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Service cart</h3>
            <div className="mt-4">
              <CartDrawer items={items} total={total} onRemove={removeItem} whatsapp={whatsapp} />
            </div>
          </aside>
        </div>
      </div>

      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg xl:hidden"
        aria-label="Open cart"
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {items.length}
          </span>
        )}
      </button>

      {cartOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 xl:hidden" onClick={() => setCartOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 xl:hidden">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">Service cart</h3>
              <button onClick={() => setCartOpen(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <CartDrawer items={items} total={total} onRemove={removeItem} whatsapp={whatsapp} />
            </div>
          </div>
        </>
      )}

      <OrderRequestModal
        open={!!selectedService}
        service={selectedService}
        whatsapp={whatsapp}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
