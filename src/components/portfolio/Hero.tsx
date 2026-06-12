"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { HeroContent } from "@/types";

export function Hero({ hero }: { hero: HeroContent }) {
  const title = hero.title || "Full-stack Developer";
  const subtitle = hero.subtitle || "";
  const intro = hero.intro || "";
  const stats = hero.stats || [];
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-10 md:py-16 lg:py-24">
      {/* ambient brand glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10" />
      <div aria-hidden className="pointer-events-none absolute -right-10 top-20 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />

      <motion.div
        className="relative grid gap-6 md:grid-cols-[1.2fr,0.8fr] md:gap-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div>
          <motion.div
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur dark:text-emerald-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for work
          </motion.div>

          <motion.h1
            variants={item}
            className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl lg:text-7xl"
          >
            Kgomotso{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              Mamogale
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
            {title}
          </motion.p>
          {(subtitle || intro) && (
            <motion.p variants={item} className="mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              {subtitle || intro}
            </motion.p>
          )}

          <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-9">
            <Link
              href="/#projects"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-center font-semibold text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.28)] transition duration-300 hover:bg-emerald-400 hover:shadow-[0_0_34px_rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              View Projects
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-center font-semibold text-slate-700 transition duration-300 hover:border-emerald-400 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:border-slate-700 dark:text-slate-200 dark:hover:text-emerald-200"
            >
              My Services
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="glass rounded-2xl p-4 shadow-[0_18px_60px_rgba(2,6,23,0.10)] md:rounded-3xl md:p-6"
        >
          {hero.image ? (
            <img src={hero.image} alt="Kgomotso Mamogale" loading="eager" fetchPriority="high" decoding="async" className="h-40 w-full rounded-xl object-cover md:h-48" />
          ) : (
            <>
              <div className="mb-3 flex gap-2 md:mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 md:h-3 md:w-3" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 md:h-3 md:w-3" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 md:h-3 md:w-3" />
              </div>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-200 md:rounded-2xl md:p-5 md:text-sm">
{`const developer = {
  name: "Kgomotso M.",
  brand: "KMDev",
  stack: ["Next.js", "TS", "MongoDB"],
  available: true
}`}
              </pre>
            </>
          )}
          {stats.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 md:mt-6 md:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                  className="rounded-xl border border-slate-200 bg-white/70 p-2.5 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 md:p-4"
                >
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-300 md:text-2xl">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500 md:text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="/#about"
        aria-label="Scroll to about section"
        className="mt-10 hidden items-center justify-center md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.span
          className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-slate-400/60 p-1 dark:border-slate-600"
          animate={reduceMotion ? {} : { y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <span className="h-2 w-1 rounded-full bg-emerald-500" />
        </motion.span>
      </motion.a>
    </section>
  );
}
