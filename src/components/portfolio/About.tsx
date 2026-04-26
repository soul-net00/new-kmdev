import type { AboutContent } from "@/types";
import { PreviewableImage } from "@/components/ui/PreviewableImage";

export function About({ about }: { about: AboutContent }) {
  const paragraphs = about.text ? [about.text] : [];
  const chips = about.highlights || [];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">About</p>
      <h2 className="text-2xl font-bold md:text-4xl">Real IT solutions, built with purpose.</h2>
      <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[0.5fr,1.5fr]">
        <PreviewableImage
          src={about.image || "/profile.jpg"}
          alt="Kgomotso Mamogale"
          className="rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800 md:rounded-3xl aspect-square"
          fallbackEmoji="👤"
        />
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