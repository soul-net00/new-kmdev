"use client";

import { useMemo, useState, useCallback } from "react";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ShareModal } from "@/components/ui/ShareModal";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;
const ITEMS_PER_PAGE_MOBILE = 1;
const ITEMS_PER_PAGE_DESKTOP = 3;

interface ShareData {
  title: string;
  url: string;
}

export function Projects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const filtered = useMemo(() => active === "All" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const availableFilters = useMemo(() => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)), [projects]);

  if (projects.length === 0) return null;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE_MOBILE);
  const visibleProjects = filtered.slice(currentPage * ITEMS_PER_PAGE_MOBILE, (currentPage + 1) * ITEMS_PER_PAGE_MOBILE);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFilterChange = useCallback((filter: typeof active) => {
    setActive(filter);
    setCurrentPage(0);
  }, []);

  const handleShare = useCallback((project: ProjectType, url: string) => {
    setShareData({ title: project.title, url });
  }, []);

  const closeShare = useCallback(() => {
    setShareData(null);
  }, []);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-10 md:py-16 overflow-hidden">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Projects</p>
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold md:text-4xl">Featured work</h2>
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => (
            <button key={filter} onClick={() => handleFilterChange(filter)} className={`rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm ${active === filter ? "bg-emerald-500 text-slate-950" : "border border-slate-300 dark:border-slate-700"}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className={`relative ${shareData ? "pointer-events-none" : ""}`}>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
          {filtered.map((project) => (
            <div key={project._id} className="w-[90vw] snap-center shrink-0 sm:w-auto">
              <ProjectCard 
                project={project} 
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-2 sm:hidden">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => !shareData && goToPage(i)}
                disabled={!!shareData}
                className={`h-2 w-2 rounded-full transition-colors ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"} ${shareData ? "opacity-50" : ""}`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <ShareModal 
        open={!!shareData} 
        onClose={closeShare}
        url={shareData?.url || ""}
        title={shareData?.title || ""}
      />
    </section>
  );
}
