import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-mono text-lg font-bold text-emerald-600">KMDev</Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#about" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">About</Link>
          <Link href="/#projects" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Projects</Link>
          <Link href="/#skills" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Skills</Link>
          <Link href="/services" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Services</Link>
          <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
