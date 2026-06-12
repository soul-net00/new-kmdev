"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ShareModal } from "@/components/ui/ShareModal";
import { ResponsiveCarousel } from "@/components/ui/ResponsiveCarousel";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;

/** Show all projects inline up to this count; beyond it, curate the homepage. */
const CURATE_THRESHOLD = 7;
const CURATED_COUNT = 6;

interface ShareData {
  title: string;
  url: string;
}

export function Projects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [shareData, setShareData] = useState<ShareData | null>(null);

  // When there are many projects, the homepage shows a curated set (featured
  // first) plus a link to the dedicated /projects page; filters are reserved
  // for that full page to keep the homepage focused.
  const isCurated = projects.length > CURATE_THRESHOLD;

  const curated = useMemo(
    () => [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, CURATED_COUNT),
    [projects]
  );

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((project) => project.category === active)),
    [active, projects]
  );

  const availableFilters = useMemo(
    () => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)),
    [projects]
  );

  const displayed = isCurated ? curated : filtered;

  const handleFilterChange = useCallback((filter: typeof active) => setActive(filter), []);
  const handleShare = useCallback((project: ProjectType, url: string) => setShareData({ title: project.title, url }), []);
  const closeShare = useCallback(() => setShareData(null), []);

  if (projects.length === 0) return null;

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

        {/* Category filters only when showing the full inline set */}
        {!isCurated && (
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
        )}
      </div>

      <ResponsiveCarousel
        key={isCurated ? "curated" : active}
        items={displayed.map((project) => ({ key: project._id || project.title }))}
        itemsPerPage={{ mobile: 1, tablet: 2, desktop: 3 }}
        ariaLabel="Featured projects carousel"
      >
        {displayed.map((project) => (
          <ProjectCard key={project._id || project.title} project={project} onShare={handleShare} />
        ))}
      </ResponsiveCarousel>

      {isCurated && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.28)] transition duration-300 hover:bg-emerald-400 hover:shadow-[0_0_34px_rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            View All Projects ({projects.length})
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}

      <ShareModal open={!!shareData} onClose={closeShare} url={shareData?.url || ""} title={shareData?.title || ""} />
    </motion.section>
  );
}
