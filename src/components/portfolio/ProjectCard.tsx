"use client";

import { useState } from "react";
import { ShareModal } from "@/components/ui/ShareModal";
import { PreviewableImage } from "@/components/ui/PreviewableImage";
import type { ProjectType } from "@/types";

export function ProjectCard({ project }: { project: ProjectType }) {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const url = project.liveUrl || project.githubUrl || "https://kmdev.example.com";

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-emerald-500/20 sm:p-5">
      <div className="mb-3 overflow-hidden rounded-xl sm:mb-4">
        <PreviewableImage
          src={project.image || ""}
          alt={project.title}
          className="h-28 w-full sm:h-32"
          fallbackEmoji="💻"
          showSparkle
        />
      </div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">{project.category}</div>
      <h3 className="text-base font-semibold sm:text-xl">{project.title}</h3>
      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 sm:text-sm">{project.description}</p>
      
      {project.highlights && project.highlights.length > 0 && (
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          {showDetails ? "Hide features ▲" : "Show features ▼"}
        </button>
      )}
      
      {showDetails && project.highlights && (
        <ul className="mt-2 space-y-1">
          {project.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-emerald-500 mt-0.5">✓</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4">
        {project.techStack.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200 sm:text-xs">{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex gap-3 text-xs sm:text-sm">
        {project.githubUrl && <a href={project.githubUrl} target="_blank" className="font-semibold text-emerald-600">GitHub ↗</a>}
        {project.liveUrl && <a href={project.liveUrl} target="_blank" className="font-semibold text-slate-700 dark:text-slate-200">Live Demo ↗</a>}
        <button onClick={() => setOpen(true)} className="font-semibold text-slate-500">Share</button>
      </div>
      <ShareModal open={open} onClose={() => setOpen(false)} url={url} title={project.title} />
    </article>
  );
}