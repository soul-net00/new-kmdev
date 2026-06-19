"use client";

import { useEffect, useRef } from "react";

export function MeshBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => el.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes mesh1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30%,20%) scale(1.1)} }
        @keyframes mesh2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20%,30%) scale(0.9)} }
        @keyframes mesh3 { 0%,100%{transform:translate(0,0) scale(1.05)} 50%{transform:translate(20%,-25%) scale(0.95)} }
        .paused .mesh-blob { animation-play-state: paused !important; }
        @media(prefers-reduced-motion:reduce) { .mesh-blob { animation: none !important; } }
      `}</style>
      <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="mesh-blob absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/[0.07] dark:bg-emerald-500/10 blur-[100px] animate-[mesh1_15s_ease-in-out_infinite]" />
        <div className="mesh-blob absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-300/[0.06] dark:bg-cyan-400/[0.08] blur-[100px] animate-[mesh2_20s_ease-in-out_infinite]" />
        <div className="mesh-blob absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-blue-300/[0.05] dark:bg-blue-500/[0.06] blur-[100px] animate-[mesh3_25s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(var(--color-background))_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.015]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
      </div>
    </>
  );
}
