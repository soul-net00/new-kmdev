"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ServiceType } from "@/types";
import { currency } from "@/lib/utils";
import { ResponsiveCarousel } from "@/components/ui/ResponsiveCarousel";

export function ServicesPreview({ services }: { services: ServiceType[] }) {
  if (!services || services.length === 0) return null;

  const previewServices = services.slice(0, 6);

  return (
    <motion.section
      className="mx-auto max-w-6xl overflow-hidden px-4 py-12 md:px-6 md:py-16 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">Services</p>
          <h2 className="text-2xl font-bold text-balance md:text-4xl">What I can help you with</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Focused service packages with clear starting points and quick ways to begin.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-400/30 px-4 py-2 text-sm font-semibold text-emerald-600 transition duration-300 hover:border-emerald-300 hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:text-emerald-300"
        >
          View all services
        </Link>
      </div>

      <ResponsiveCarousel
        items={previewServices.map((service) => ({ key: service._id || service.name }))}
        itemsPerPage={{ mobile: 1, tablet: 2, desktop: 3 }}
        ariaLabel="Services carousel"
      >
        {previewServices.map((service) => (
          <article
            key={service._id || service.name}
            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_0_34px_rgba(16,185,129,0.18)] dark:bg-slate-900/80 sm:p-6"
          >
            {service.image && (
              <div className="mb-4 overflow-hidden rounded-xl">
                <img src={service.image} alt={service.name} className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
            )}
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
            <div className="mt-auto pt-5">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">From {currency(service.priceFrom)}</p>
            </div>
          </article>
        ))}
      </ResponsiveCarousel>
    </motion.section>
  );
}
