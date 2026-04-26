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

  const totalMobilePages = Math.ceil(filtered.length / ITEMS_PER_PAGE_MOBILE);
  const totalDesktopPages = Math.ceil(filtered.length / ITEMS_PER_PAGE_DESKTOP);

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

  const mobileProjects = filtered.slice(currentPage * ITEMS_PER_PAGE_MOBILE, (currentPage + 1) * ITEMS_PER_PAGE_MOBILE);
  const desktopProjects = filtered.slice(currentPage * ITEMS_PER_PAGE_DESKTOP, (currentPage + 1) * ITEMS_PER_PAGE_DESKTOP);

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
        <div className="flex snap-x snap-mandatory overflow-x-hidden pb-4 lg:snap-none lg:overflow-visible">
          <div className="flex snap-x snap-mandatory overflow-x-visible pb-4 sm:hidden w-full">
            {filtered.map((project) => (
              <div key={project._id} className="min-w-full w-full flex-shrink-0 px-1">
                <ProjectCard project={project} onShare={handleShare} />
              </div>
            ))}
          </div>
          <div className="hidden sm:grid lg:grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            {desktopProjects.map((project) => (
              <ProjectCard key={project._id} project={project} onShare={handleShare} />
            ))}
          </div>
        </div>
        
        {totalDesktopPages > 1 && (
          <>
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 0 || !!shareData}
              className="absolute left-0 top-1/2 z-10 hidden lg:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all hover:border-emerald-400 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900" 
              aria-label="Previous"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalDesktopPages - 1 || !!shareData}
              className="absolute right-0 top-1/2 z-10 hidden lg:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-all hover:border-emerald-400 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900" 
              aria-label="Next"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: totalMobilePages }).map((_, i) => (
            <button 
              key={i} 
              onClick={() => !shareData && goToPage(i)}
              disabled={!!shareData}
              className={`h-2 w-2 rounded-full transition-colors sm:hidden ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"} ${shareData ? "opacity-50" : ""}`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
          {Array.from({ length: totalDesktopPages }).map((_, i) => (
            <button 
              key={`desktop-${i}`} 
              onClick={() => !shareData && goToPage(i)}
              disabled={!!shareData}
              className={`h-2 w-2 rounded-full transition-colors hidden sm:block lg:block ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"} ${shareData ? "opacity-50" : ""}`}
              aria-label={`Go to desktop page ${i + 1}`}
            />
          ))}
        </div>
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
