"use client";

import { motion, useReducedMotion } from "framer-motion";
import { whatsappLink } from "@/lib/utils";
import type { SiteSettings } from "@/types";

export function Contact({ settings }: { settings: SiteSettings }) {
  const contact = settings.contact || { email: "", whatsapp: "" };
  const email = contact.email || "kgomotsothabo2004@gmail.com";
  const whatsapp = contact.whatsapp || "0601603996";
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 md:py-16"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="glass grid gap-6 rounded-2xl p-5 shadow-[0_18px_60px_rgba(2,6,23,0.10)] md:grid-cols-2 md:rounded-3xl md:p-8">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Contact</p>
          <h2 className="text-2xl font-bold text-balance md:text-3xl">Let&apos;s build something useful.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 md:mt-4">
            Available for freelance work, internships, websites, IT support, and networking help.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <a
            href={`mailto:${email}`}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors duration-300 hover:border-emerald-400 hover:bg-emerald-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:border-slate-800 dark:hover:bg-emerald-500/5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0 break-all font-medium text-slate-700 dark:text-slate-200">{email}</span>
          </a>
          <a
            href={whatsappLink(whatsapp, "Hi KMDev, I would like to discuss a project.")}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-3 rounded-xl bg-[#25D366] px-3.5 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition duration-300 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.95-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.43 0 1.44 1.05 2.82 1.2 3.02.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.98-1.4.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.57-.34Z" />
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </motion.section>
  );
}
