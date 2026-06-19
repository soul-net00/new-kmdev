"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import type { HeroContent } from "@/types";

const ROLES = ["Full Stack Developer", "Web Developer", "UI/UX Designer", "PWA Specialist", "Software Engineer"];
const INTERVAL = 2800;

function TextRotator({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => setIndex((i) => (i + 1) % phrases.length), INTERVAL);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [phrases.length]);

  return (
    <span className="relative inline-block h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="inline-block"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CountUp({ value }: { value: string }) {
  const num = parseInt(value);
  const suffix = value.replace(/\d/g, "");
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (isNaN(num)) return;
    let frame: number, start = performance.now();
    const duration = 1500;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * num));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [num]);
  return <>{isNaN(num) ? value : `${count}${suffix}`}</>;
}

export function Hero({ hero }: { hero: HeroContent }) {
  const roles = hero.title ? [hero.title, ...ROLES.slice(1)] : ROLES;
  const reduceMotion = useReducedMotion();
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } };
  const item: Variants = { hidden: { opacity: 0, y: reduceMotion ? 0 : 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <section className="relative min-h-[85dvh] flex items-center overflow-hidden px-4">
      {/* Mesh gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-emerald-500 opacity-[0.08] dark:opacity-[0.15] blur-3xl animate-[blob1_18s_infinite]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-cyan-400 opacity-[0.06] dark:opacity-[0.15] blur-3xl animate-[blob2_15s_infinite]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-500 opacity-[0.05] dark:opacity-[0.15] blur-3xl animate-[blob3_20s_infinite]" />
      </div>

      <motion.div className="relative mx-auto max-w-6xl w-full grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center" variants={container} initial="hidden" animate="show">
        {/* Left content */}
        <div>
          <motion.div variants={item} className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
            Available for work
          </motion.div>

          <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white">
            Kgomotso{" "}<span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">Mamogale</span>
          </motion.h1>

          <motion.div variants={item} className="mt-4 font-mono text-lg text-emerald-600 dark:text-emerald-300 flex items-center">
            <TextRotator phrases={roles} />
            <span className="ml-1 h-5 w-[2px] bg-emerald-400 animate-[blink_1s_steps(1)_infinite]" />
          </motion.div>

          <motion.p variants={item} className="mt-4 max-w-lg text-slate-600 dark:text-slate-400">{hero.subtitle || hero.intro}</motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {(hero.cta || []).map((c, i) => (
              <Link key={c.href} href={c.href} className={i === 0
                ? "inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition cursor-pointer"
                : "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-200 ring-1 ring-white/10 hover:ring-emerald-400/50 transition cursor-pointer"
              }>{c.label}</Link>
            ))}
          </motion.div>
        </div>

        {/* Right side: terminal card or image */}
        <motion.div variants={item} className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-slate-900/80 dark:shadow-2xl">
          {hero.image ? (
            <img src={hero.image} alt="Kgomotso Mamogale" className="w-full rounded-xl object-cover" />
          ) : (
            <>
              <div className="mb-3 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200">
{`const developer = {
  name: "Kgomotso M.",
  brand: "KMDev",
  stack: ["Next.js", "TS", "MongoDB"],
  available: true
}`}
              </pre>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Stats row */}
      {hero.stats && hero.stats.length > 0 && (
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          {hero.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-emerald-400"><CountUp value={s.value} /></div>
              <div className="text-xs uppercase tracking-wide text-slate-500">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob1 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(60px,40px) } }
        @keyframes blob2 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-50px,30px) } }
        @keyframes blob3 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(40px,-50px) } }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
      `}} />
    </section>
  );
}
