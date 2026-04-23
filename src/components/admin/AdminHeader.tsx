import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export async function AdminHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h1 className="text-lg font-bold dark:text-white sm:text-xl">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your website content</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden text-right text-sm sm:block">
          <div className="dark:text-white">{session?.user?.email || "Admin"}</div>
          <div className="font-mono text-emerald-600 dark:text-emerald-500">Logged in</div>
        </div>
        <AdminSignOutButton />
      </div>
    </header>
  );
}