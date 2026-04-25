import Link from "next/link";
import type { ServiceType } from "@/types";
import { currency } from "@/lib/utils";

export function ServicesPreview({ services }: { services: ServiceType[] }) {
  if (!services || services.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Services</p>
          <h2 className="text-2xl font-bold md:text-4xl">What I can help you with</h2>
        </div>
        <Link href="/services" className="text-sm font-semibold text-emerald-600 whitespace-nowrap">
          View all services →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <div key={service.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            {service.image && (
              <img src={service.image} alt={service.name} className="w-full rounded-lg object-cover h-32 mb-3" />
            )}
            <h3 className="text-base font-semibold sm:text-lg">{service.name}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{service.description}</p>
            <p className="mt-4 text-sm font-semibold text-emerald-600">From {currency(service.priceFrom)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
