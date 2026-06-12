"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { setScrollLock } from "@/lib/utils";

const links = [
  { href: "/#about", label: "About", section: "about" },
  { href: "/#projects", label: "Projects", section: "projects" },
  { href: "/#skills", label: "Skills", section: "skills" },
  { href: "/services", label: "Services", section: "services" },
  { href: "/#contact", label: "Contact", section: "contact" },
  { href: "/admin", label: "Admin", section: "admin" }
];

export function MobileNav({ activeSection = "about" }: { activeSection?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setScrollLock(open);
    return () => {
      setScrollLock(false);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (section: string) => {
    if (section === "services") return pathname?.startsWith("/services");
    if (section === "admin") return pathname?.startsWith("/admin");
    return pathname === "/" && activeSection === section;
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300/70 bg-white/70 text-slate-900 transition hover:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-80 rounded-2xl border border-white/10 bg-white/95 p-2 shadow-[0_22px_70px_rgba(2,6,23,0.28)] backdrop-blur-xl dark:bg-slate-900/95"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-label="Mobile navigation"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mb-1 block rounded-xl px-4 py-3 text-sm font-semibold transition last:mb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                    isActive(link.section)
                      ? "bg-emerald-400 text-slate-950"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
