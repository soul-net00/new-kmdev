"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ProjectType } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { ShareModal } from "@/components/ui/ShareModal";
import { ResponsiveCarousel } from "@/components/ui/ResponsiveCarousel";

const filters = ["All", "Web", "Desktop", "Database", "Other"] as const;
const CURATE_THRESHOLD = 7;
const CURATED_COUNT = 6;

export function Projects({ projects }: { projects: ProjectType[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Spotlight mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const spotY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) { mouseX.set(e.clientX - rect.left); mouseY.set(e.clientY - rect.top); }
  }, [mouseX, mouseY]);

  const isCurated = projects.length > CURATE_THRESHOLD;
  const curated = useMemo(() => [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, CURATED_COUNT), [projects]);
  const filtered = useMemo(() => (active === "All" ? projects : projects.filter((p) => p.category === active)), [active, projects]);
  const availableFilters = useMemo(() => filters.filter((f) => f === "All" || projects.some((p) => p.category === f)), [projects]);
  const displayed = isCurated ? curated : filtered;

  const handleShare = useCallback((project: ProjectType, url: string) => setShareData({ title: project.title, url }), []);

  if (projects.length === 0) return null;

  return (
    <motion.section
      ref={sectionRef}
      id="projects"
      className="relative mx-auto max-w-6xl scroll-mt-24 overflow-hidden px-4 py-20 md:px-6 md:py-28 lg:px-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight */}
      <motion.div
        className="pointer-events-none absolute -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400/[0.04] blur-[80px]"
        style={{ left: spotX, top: spotY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Header */}
      <div className="mb-10 md:mb-14">
        <motion.p
          className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-emerald-400"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Featured Work
        </motion.p>
        <motion.h2
          className="text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
        >
          Building modern digital experiences
        </motion.h2>
        <motion.p
          className="mt-3 max-w-lg text-base text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Production-minded builds with clean interfaces, practical automation, and stable user flows.
        </motion.p>

        {/* Filters */}
        {!isCurated && (
          <div className="mt-6 flex flex-wrap gap-2">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                  active === filter
                    ? "bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-slate-400 ring-1 ring-white/5 hover:bg-white/10 hover:text-white"
                }`}
                aria-pressed={active === filter}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Carousel */}
      <ResponsiveCarousel
        key={isCurated ? "curated" : active}
        items={displayed.map((p) => ({ key: p._id || p.title }))}
        ariaLabel="Featured projects carousel"
      >
        {displayed.map((project, i) => (
          <ProjectCard key={project._id || project.title} project={project} onShare={handleShare} index={i} />
        ))}
      </ResponsiveCarousel>

      {/* View all */}
      {isCurated && (
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-[0_4px_24px_rgba(16,185,129,0.25)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)] active:scale-[0.97]"
          >
            View All Projects ({projects.length})
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      )}

      <ShareModal open={!!shareData} onClose={() => setShareData(null)} url={shareData?.url || ""} title={shareData?.title || ""} />
    </motion.section>
  );
}
