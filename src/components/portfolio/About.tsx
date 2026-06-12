"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { AboutContent } from "@/types";
import { PreviewableImage } from "@/components/ui/PreviewableImage";

export function About({ about }: { about: AboutContent }) {
  const paragraphs = about.text ? [about.text] : [];
  const chips = about.highlights || [];
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 md:py-16"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">About</p>
      <h2 className="text-2xl font-bold text-balance md:text-4xl">Real IT solutions, built with purpose.</h2>
      <div className="mt-6 flex flex-col items-center gap-6 md:mt-8 md:grid md:grid-cols-[0.5fr,1.5fr] md:items-start md:gap-8">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md md:inset-0 md:blur-xl" />
          <PreviewableImage
            src={about.image || "/profile.jpg"}
            alt="Kgomotso Mamogale"
            className="relative h-36 w-36 rounded-full border-2 border-emerald-500/50 object-cover shadow-lg md:h-40 md:w-40 lg:h-48 lg:w-48"
            fallbackEmoji="KM"
            showSparkle={false}
          />
        </motion.div>
        <div className="text-center md:text-left">
          {paragraphs.map((paragraph, i) => (
            <motion.p
              key={paragraph}
              className="mb-3 text-sm leading-7 text-slate-600 dark:text-slate-300 md:mb-4 md:text-base"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: "easeOut" }}
            >
              {paragraph}
            </motion.p>
          ))}
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:mt-6 md:justify-start md:gap-3">
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition-colors duration-300 hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200 dark:hover:text-emerald-200 md:px-4 md:py-2 md:text-sm"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.35, delay: 0.25 + i * 0.05, ease: "easeOut" }}
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
