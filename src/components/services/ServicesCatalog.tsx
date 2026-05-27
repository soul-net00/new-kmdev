"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/services/CartDrawer";
import { OrderRequestModal } from "@/components/services/OrderRequestModal";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { ServiceType } from "@/types";

export function ServicesCatalog({ services, whatsapp }: { services: ServiceType[]; whatsapp: string }) {
  const { items, total, addItem, removeItem } = useCart();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  if (services.length === 0) return null;

  return (
    <>
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-[1fr,320px]">
        <div className="relative">
          <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service._id || service.name} className="w-full">
                <ServiceCard
                  service={service}
                  onAddToCart={addItem}
                  onRequest={setSelectedService}
                  whatsapp={whatsapp}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="hidden xl:block">
          <aside className="sticky top-24 rounded-3xl border border-white/10 bg-white/85 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.08)] backdrop-blur dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold">Service cart</h3>
            <div className="mt-4">
              <CartDrawer items={items} total={total} onRemove={removeItem} whatsapp={whatsapp} />
            </div>
          </aside>
        </div>
      </div>

      <button
        onClick={() => setCartOpen(true)}
        className="fixed left-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-slate-950 shadow-[0_0_28px_rgba(52,211,153,0.35)] transition duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 xl:hidden"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        aria-label="Open cart"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {items.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm xl:hidden"
            onClick={() => setCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-white shadow-xl dark:bg-slate-900 xl:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">Service cart</h3>
              <button onClick={() => setCartOpen(false)} className="rounded-lg p-2 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:hover:bg-slate-800" aria-label="Close cart">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <CartDrawer items={items} total={total} onRemove={removeItem} whatsapp={whatsapp} />
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>

      <OrderRequestModal
        open={!!selectedService}
        service={selectedService}
        whatsapp={whatsapp}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
