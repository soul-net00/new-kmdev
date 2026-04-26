import Link from "next/link";
import type { HeroContent } from "@/types";

export function Hero({ hero }: { hero: HeroContent }) {
  const title = hero.title || "Full-stack Developer";
  const subtitle = hero.subtitle || "";
  const intro = hero.intro || "";
  const stats = hero.stats || [];

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr,0.8fr] md:gap-10 md:py-16 lg:py-24">
      <div>
        <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-slate-100 md:mb-4">
          Available for work
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl lg:text-7xl">
          Kgomotso <span className="text-emerald-600">Mamogale</span>
        </h1>
        <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300 md:mt-4 md:text-lg">{title}</p>
        <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 md:mt-3">{subtitle || intro}</p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
          <Link href="/#projects" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-600">View Projects</Link>
          <Link href="/services" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700">My Services</Link>
        </div>
      </div>
<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 md:rounded-3xl md:p-6">
        {hero.image ? (
          <img src={hero.image} alt="Kgomotso Mamogale" className="w-full rounded-xl object-cover max-h-48 mb-4 transition-transform duration-300 hover:scale-[1.02]" />
        ) : (
          <>
            <div className="mb-3 flex gap-2 md:mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 md:h-3 md:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 md:h-3 md:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 md:h-3 md:w-3" />
            </div>
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-200 md:rounded-2xl md:p-5 md:text-sm">
{`const developer = {
  name: "Kgomotso M.",
  brand: "KMDev",
  stack: ["Next.js", "TS", "MongoDB"],
  available: true
}`}
            </pre>
          </>
        )}
        <div className="mt-4 grid grid-cols-3 gap-2 md:mt-6 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-950 md:p-4">
              <div className="text-lg font-bold text-emerald-600 md:text-2xl">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500 md:text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
