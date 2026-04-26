"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => active === "All" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const availableFilters = useMemo(() => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)), [projects]);

  if (projects.length === 0) return null;

  const totalMobilePages = Math.ceil(filtered.length / ITEMS_PER_PAGE_MOBILE);
  const totalDesktopPages = Math.ceil(filtered.length / ITEMS_PER_PAGE_DESKTOP);
  const desktopProjects = filtered.slice(currentPage * ITEMS_PER_PAGE_DESKTOP, (currentPage + 1) * ITEMS_PER_PAGE_DESKTOP);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: page * cardWidth, behavior: "smooth" });
    }
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

  const handleScroll = useCallback(() => {
    if (scrollRef.current && window.innerWidth < 1024) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.clientWidth;
      const newPage = Math.round(scrollLeft / cardWidth);
      if (newPage !== currentPage && newPage >= 0 && newPage < totalMobilePages) {
        setCurrentPage(newPage);
      }
    }
  }, [currentPage, totalMobilePages]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-10 md:py-16">
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
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0 lg:snap-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filtered.map((project) => (
            <div key={project._id} className="w-[85vw] flex-shrink-0 snap-center pr-2 sm:w-auto sm:pr-0 lg:basis-1/3">
              <ProjectCard project={project} onShare={handleShare} />
            </div>
          ))}
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
              onClick={() => goToPage(i)}
              disabled={!!shareData}
              className={`h-2 w-2 rounded-full transition-colors sm:hidden ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"} ${shareData ? "opacity-50" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          {Array.from({ length: totalDesktopPages }).map((_, i) => (
            <button 
              key={`desktop-${i}`} 
              onClick={() => goToPage(i)}
              disabled={!!shareData}
              className={`h-2 w-2 rounded-full transition-colors hidden sm:block lg:block ${currentPage === i ? "bg-emerald-500" : "bg-slate-300"} ${shareData ? "opacity-50" : ""}`}
              aria-label={`Go to desktop slide ${i + 1}`}
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
