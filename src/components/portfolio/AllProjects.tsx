"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ShareModal } from "@/components/ui/ShareModal";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;
const PAGE_SIZE = 9;

export function AllProjects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);

  const availableFilters = useMemo(
    () => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)),
    [projects]
  );

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active, projects]
  );

  // Reset pagination whenever the active filter changes.
  useEffect(() => setVisible(PAGE_SIZE), [active]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleShare = useCallback((project: ProjectType, url: string) => setShareData({ title: project.title, url }), []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <Link href="/#projects" className="text-sm text-emerald-600 hover:underline dark:text-emerald-400">← Back to home</Link>
      <p className="mt-3 mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Portfolio</p>
      <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">All Projects</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
        {projects.length} project{projects.length === 1 ? "" : "s"} across web, desktop, data and more.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {availableFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
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

      {shown.length === 0 ? (
        <p className="mt-10 text-sm text-slate-500">No projects in this category.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <motion.div
              key={project._id || project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, PAGE_SIZE) * 0.04, ease: "easeOut" }}
            >
              <ProjectCard project={project} onShare={handleShare} />
            </motion.div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 px-6 py-3 font-semibold text-emerald-600 transition duration-300 hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:text-emerald-300"
          >
            Load more ({filtered.length - visible} remaining)
          </button>
        </div>
      )}

      <ShareModal open={!!shareData} onClose={() => setShareData(null)} url={shareData?.url || ""} title={shareData?.title || ""} />
    </section>
  );
}
