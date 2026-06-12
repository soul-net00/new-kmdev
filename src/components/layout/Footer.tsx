import Link from "next/link";

const quickLinks = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/services", label: "Services" },
  { href: "/#contact", label: "Contact" }
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-slate-200/80 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
              KMDev
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Full-stack development, IT support, and networking — built with purpose by Kgomotso Mamogale.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-500 transition-colors duration-300 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>© {year} KMDev. Built with Next.js, TypeScript, Tailwind CSS &amp; MongoDB.</div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition-colors duration-300 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
          >
            Back to top
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
