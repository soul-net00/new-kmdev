import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileShell } from "@/components/admin/AdminMobileShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <AdminMobileShell>
        <div className="mx-auto max-w-7xl p-4 lg:p-6">
          <AdminHeader />
          <div className="mt-6 grid gap-6 lg:grid-cols-[260px,1fr]">
            <aside className="hidden lg:block">
              <AdminSidebar />
            </aside>
            <main className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </AdminMobileShell>
    </div>
  );
}