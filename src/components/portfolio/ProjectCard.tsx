"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import type { ProjectType } from "@/types";

interface ProjectCardProps {
  project: ProjectType;
  onShare?: (project: ProjectType, url: string) => void;
  index?: number;
}

export function ProjectCard({ project, onShare, index = 0 }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Card-local spotlight
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 200, damping: 25 });
  const smy = useSpring(my, { stiffness: 200, damping: 25 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const images = project.image ? [project.image] : [];

  const handleShare = () => onShare?.(project, project.liveUrl || project.githubUrl || "");

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
      whileHover={reduceMotion ? {} : { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      onMouseMove={handleMouse}
      className="group/card relative flex h-full min-h-[28rem] flex-col rounded-[1.5rem] p-px transition-shadow duration-500 hover:shadow-[0_24px_80px_rgba(16,185,129,0.08)]"
      style={{ touchAction: "pan-y" }}
    >
      {/* Animated gradient border — pointer-events-none so it never traps touch */}
      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-emerald-400/20 via-transparent to-cyan-400/20 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
      <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

      {/* Card spotlight glow — pointer-events-none */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: `radial-gradient(400px circle at calc(${smx.get() * 100}% + 0px) calc(${smy.get() * 100}% + 0px), rgba(16,185,129,0.06), transparent 60%)` }}
      />

      {/* Inner content */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] border border-gray-200/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-transparent dark:bg-slate-900/95 dark:shadow-none">
        <div className="flex h-full flex-col p-5 sm:p-6">
          {/* Image — click to open lightbox */}
          <div className="relative mb-5 overflow-hidden rounded-xl">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); if (images.length) setLightboxOpen(true); }}
              className="group/img relative block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={`View ${project.title} full size`}
            >
              <div className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/img:scale-[1.04]">
                {project.image ? (
                  <img src={project.image} alt={project.title} loading="lazy" decoding="async" className="h-44 w-full rounded-xl object-cover sm:h-48" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-48">
                    <span className="font-mono text-2xl font-bold text-emerald-500">KM</span>
                  </div>
                )}
              </div>
              {/* Hover overlay */}
              {images.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-all duration-300 group-hover/img:bg-black/30">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-900 opacity-0 shadow-lg transition-all duration-300 group-hover/img:opacity-100">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    View Full Size
                  </span>
                </div>
              )}
            </button>
            {/* Category badge */}
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              {project.category}
            </span>
          </div>

          {/* Lightbox */}
          <ImageLightbox images={images} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />

          {/* Title */}
          <h3 className="text-lg font-bold leading-tight tracking-tight sm:text-xl">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{project.description}</p>

          {/* Features toggle */}
          {project.highlights && project.highlights.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="mt-3 w-fit cursor-pointer rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-400 ring-1 ring-white/5 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-300 hover:ring-emerald-500/20"
              aria-expanded={showDetails}
            >
              {showDetails ? "Hide features" : "Show features"}
            </button>
          )}

          <AnimatePresence initial={false}>
            {showDetails && project.highlights && (
              <motion.ul
                className="mt-3 space-y-1.5 overflow-hidden rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              >
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] leading-5 text-slate-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    {h}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Tech stack badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 5).map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400 ring-1 ring-white/5 transition-colors duration-300 group-hover/card:text-emerald-300/70"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Action buttons — fade in on hover */}
          <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)] active:scale-[0.96]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-slate-300 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/5 hover:text-white hover:ring-white/20 active:scale-[0.96]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                Source
              </a>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-white/5 hover:text-slate-300 active:scale-[0.95]"
              aria-label="Share project"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
