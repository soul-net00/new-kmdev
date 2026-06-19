"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ServiceType } from "@/types";
import { currency } from "@/lib/utils";
import { ResponsiveCarousel } from "@/components/ui/ResponsiveCarousel";

function ServiceCard({ service, index }: { service: ServiceType; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20, filter: reduceMotion ? "none" : "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
      className="group/svc relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.25rem] border border-gray-200/60 bg-white shadow-[0_2px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(16,185,129,0.08)] dark:border-white/[0.06] dark:bg-slate-900/90 dark:shadow-[0_2px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_60px_rgba(16,185,129,0.06)]"
    >
      <div className="flex h-full flex-col p-1.5">
        <div className="flex h-full flex-col rounded-[0.9rem] bg-white p-5 ring-1 ring-black/[0.03] dark:bg-slate-900 dark:ring-white/[0.04] sm:p-6">
          {service.image && (
            <div className="mb-4 overflow-hidden rounded-xl">
              <img
                src={service.image}
                alt={service.name}
                loading="lazy"
                decoding="async"
                className="h-36 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/svc:scale-105"
              />
            </div>
          )}
          <h3 className="text-lg font-semibold tracking-tight">{service.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-600 dark:text-slate-400">{service.description}</p>
          <div className="mt-auto pt-5">
            <span className="inline-block rounded-md bg-emerald-500/8 px-2.5 py-1 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-500/10 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/10">
              From {currency(service.priceFrom)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ServicesPreview({ services }: { services: ServiceType[] }) {
  if (!services || services.length === 0) return null;

  const previewServices = services.slice(0, 6);

  return (
    <motion.section
      className="mx-auto max-w-6xl overflow-hidden px-4 py-20 md:px-6 md:py-28 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">Services</p>
          <h2 className="text-2xl font-bold tracking-tight text-balance md:text-4xl">What I can help you with</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Focused service packages with clear starting points and quick ways to begin.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] active:scale-[0.97] dark:text-emerald-300"
        >
          View all services
        </Link>
      </div>

      <ResponsiveCarousel
        items={previewServices.map((service) => ({ key: service._id || service.name }))}
        itemsPerPage={{ mobile: 1, tablet: 2, desktop: 3 }}
        ariaLabel="Services carousel"
      >
        {previewServices.map((service, i) => (
          <ServiceCard key={service._id || service.name} service={service} index={i} />
        ))}
      </ResponsiveCarousel>
    </motion.section>
  );
}
