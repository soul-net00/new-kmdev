import type { AboutContent } from "@/types";

export function About({ about }: { about: AboutContent }) {
  const paragraphs = about.text ? [about.text] : [];
  const chips = about.highlights || [];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">About</p>
      <h2 className="text-2xl font-bold md:text-4xl">Real IT solutions, built with purpose.</h2>
      <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[0.5fr,1.5fr]">
        {about.image || "/profile.jpg" ? (
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 md:rounded-3xl aspect-square">
            <img 
              src={about.image || "/profile.jpg"} 
              alt="Kgomotso Mamogale" 
              className="h-full w-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-100 p-6 text-4xl font-black text-emerald-700 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-emerald-500 md:rounded-3xl md:p-8 md:text-6xl">
            KM
          </div>
        )}
        <div>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mb-3 text-sm text-slate-600 dark:text-slate-300 md:mb-4 md:text-base">{paragraph}</p>
          ))}
          <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 md:px-4 md:py-2 md:text-sm">{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
