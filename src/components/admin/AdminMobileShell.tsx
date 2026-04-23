"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminMobileShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col rounded-r-2xl border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-500">KMDev Admin</span>
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <AdminSidebar />
            </div>
          </div>
        </>
      )}
      {children}
    </>
  );
}