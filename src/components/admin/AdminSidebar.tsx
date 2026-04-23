"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  ["/admin", "Overview"],
  ["/admin/homepage", "Homepage"],
  ["/admin/about", "About"],
  ["/admin/projects", "Projects"],
  ["/admin/skills", "Skills"],
  ["/admin/services", "Services"],
  ["/admin/orders", "Orders"],
  ["/admin/receipts", "Receipts"],
  ["/admin/contact", "Contact"],
  ["/admin/settings", "Settings"],
  ["/admin/security", "Security"],
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-500">KMDev Admin</div>
      <nav className="space-y-1">
        {items.map(([href, label]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}