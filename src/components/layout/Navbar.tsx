"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#about", label: "About", section: "about" },
  { href: "/#projects", label: "Projects", section: "projects" },
  { href: "/#skills", label: "Skills", section: "skills" },
  { href: "/services", label: "Services", section: "services" },
  { href: "/admin", label: "Admin", section: "admin" },
  { href: "/shop.html", label: "Receipts", section: "receipts" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const sections = links.map((l) => l.section);
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 50);
      setLastY(y);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, [lastY]);

  const isActive = (section: string) =>
    pathname === `/${section}` || activeSection === section;

  return (
    <motion.nav
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-5 left-4 right-4 z-40 mx-auto max-w-4xl rounded-full
        bg-white/75 dark:bg-slate-900/70 backdrop-blur-[18px]
        border border-black/[0.05] dark:border-white/10
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        px-5 py-2.5 flex items-center justify-between"
    >
      <Link href="/" className="font-bold text-lg tracking-tight">
        KMDev
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.section}
            href={link.href}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              isActive(link.section)
                ? "bg-emerald-500 text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <MobileNav activeSection={activeSection} />
      </div>
    </motion.nav>
  );
}
