"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#about", label: "About", section: "about" },
  { href: "/#projects", label: "Projects", section: "projects" },
  { href: "/#skills", label: "Skills", section: "skills" },
  { href: "/services", label: "Services", section: "services" },
  { href: "/admin", label: "Admin", section: "admin" }
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["about", "projects", "skills", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.12, 0.35, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (section: string) => {
    if (section === "services") return pathname?.startsWith("/services");
    if (section === "admin") return pathname?.startsWith("/admin");
    return pathname === "/" && activeSection === section;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-white/82 backdrop-blur-xl dark:bg-slate-950/82">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-lg font-mono text-lg font-bold text-emerald-500 transition hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          KMDev
        </Link>
        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                isActive(link.section)
                  ? "bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.22)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
              aria-current={isActive(link.section) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileNav activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}
