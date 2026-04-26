import type { AboutContent } from "@/types";
import { PreviewableImage } from "@/components/ui/PreviewableImage";

export function About({ about }: { about: AboutContent }) {
  const paragraphs = about.text ? [about.text] : [];
  const chips = about.highlights || [];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">About</p>
      <h2 className="text-xl font-bold md:text-4xl">Real IT solutions, built with purpose.</h2>
      <div className="mt-6 flex flex-col items-center gap-4 md:mt-8 md:grid md:grid-cols-[0.5fr,1.5fr] md:items-start">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md md:inset-0 md:blur-xl" />
          <PreviewableImage
            src={about.image || "/profile.jpg"}
            alt="Kgomotso Mamogale"
            className="relative w-36 h-36 rounded-full border-2 border-emerald-500/50 object-cover shadow-lg md:w-40 md:h-40 lg:w-48 lg:h-48"
            fallbackEmoji="👤"
            showSparkle={false}
          />
        </div>
        <div className="text-center md:text-left">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mb-3 text-sm text-slate-600 dark:text-slate-300 md:mb-4 md:text-base">{paragraph}</p>
          ))}
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:mt-6 md:gap-3 md:justify-start">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 md:px-4 md:py-2 md:text-sm">{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}