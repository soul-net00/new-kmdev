"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PreviewableImage } from "@/components/ui/PreviewableImage";
import type { ProjectType } from "@/types";

interface ProjectCardProps {
  project: ProjectType;
  onShare?: (project: ProjectType, url: string) => void;
}

export function ProjectCard({ project, onShare }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleShare = () => {
    const url = project.liveUrl || project.githubUrl || "https://kmdev.example.com";
    onShare?.(project, url);
  };

  return (
    <motion.article
      layout
      className="group flex h-full min-h-[28rem] flex-col rounded-2xl border border-white/10 bg-white/85 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.08)] backdrop-blur transition-colors duration-300 hover:border-emerald-400/40 hover:shadow-[0_0_34px_rgba(16,185,129,0.2)] dark:bg-slate-900/80 sm:p-5"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mb-4 overflow-hidden rounded-xl">
        <PreviewableImage
          src={project.image || ""}
          alt={project.title}
          className="h-40 w-full sm:h-44"
          fallbackEmoji="KM"
          showSparkle
        />
      </div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500 dark:text-emerald-300">{project.category}</div>
      <h3 className="text-lg font-semibold leading-tight sm:text-xl">{project.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>

      {project.highlights && project.highlights.length > 0 && (
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 w-fit rounded-full border border-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:text-emerald-300"
          aria-expanded={showDetails}
        >
          {showDetails ? "Hide features" : "Show features"}
        </button>
      )}

      <AnimatePresence initial={false}>
        {showDetails && project.highlights && (
          <motion.ul
            className="mt-3 space-y-2 overflow-hidden rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {project.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {highlight}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-5 text-sm">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-400/30 px-3 font-semibold text-emerald-600 transition hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:text-emerald-300">
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900 px-3 font-semibold text-white transition hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:bg-white dark:text-slate-950">
            Live demo
          </a>
        )}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-10 items-center justify-center rounded-full px-3 font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          Share
        </button>
      </div>
    </motion.article>
  );
}
