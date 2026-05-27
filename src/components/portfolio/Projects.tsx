"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ShareModal } from "@/components/ui/ShareModal";
import { ResponsiveCarousel } from "@/components/ui/ResponsiveCarousel";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;

interface ShareData {
  title: string;
  url: string;
}

export function Projects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const filtered = useMemo(() => active === "All" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const availableFilters = useMemo(() => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)), [projects]);

  if (projects.length === 0) return null;

  const handleFilterChange = useCallback((filter: typeof active) => {
    setActive(filter);
  }, []);

  const handleShare = useCallback((project: ProjectType, url: string) => {
    setShareData({ title: project.title, url });
  }, []);

  const closeShare = useCallback(() => {
    setShareData(null);
  }, []);

  return (
    <motion.section
      id="projects"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 md:px-6 md:py-16 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">Projects</p>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance md:text-4xl">Featured work</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Production-minded builds with clean interfaces, practical automation, and stable user flows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterChange(filter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                active === filter
                  ? "bg-emerald-400 text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.28)]"
                  : "border border-slate-300/70 bg-white/60 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-emerald-200"
              }`}
              aria-pressed={active === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveCarousel
        key={active}
        items={filtered.map((project) => ({ key: project._id || project.title }))}
        itemsPerPage={{ mobile: 1, tablet: 2, desktop: 3 }}
        ariaLabel="Featured projects carousel"
      >
        {filtered.map((project) => (
          <ProjectCard key={project._id || project.title} project={project} onShare={handleShare} />
        ))}
      </ResponsiveCarousel>

      <ShareModal 
        open={!!shareData} 
        onClose={closeShare}
        url={shareData?.url || ""}
        title={shareData?.title || ""}
      />
    </motion.section>
  );
}
