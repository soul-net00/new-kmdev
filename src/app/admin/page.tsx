import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminCounts } from "@/lib/data";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const counts = await getAdminCounts();
  const cards = [
    { label: "Total Projects", value: counts.projects, href: "/admin/projects", color: "emerald" },
    { label: "Total Services", value: counts.services, href: "/admin/services", color: "blue" },
    { label: "Total Orders", value: counts.orders, href: "/admin/orders", color: "purple" },
    { label: "Pending Orders", value: counts.pendingOrders, href: "/admin/orders", color: "amber" },
    { label: "Receipts", value: counts.receipts, href: "/admin/receipts", color: "cyan" },
    { label: "Activity Logs", value: counts.activities, href: "/admin/settings", color: "rose" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="text-slate-400">Your website at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700"
          >
            <div className="text-sm text-slate-400">{card.label}</div>
            <div className={`mt-1 text-3xl font-bold text-${card.color}-500`}>{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/projects" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center transition hover:border-emerald-500/50">
          <div className="text-emerald-500">+ Add Project</div>
        </Link>
        <Link href="/admin/services" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center transition hover:border-blue-500/50">
          <div className="text-blue-500">+ Add Service</div>
        </Link>
        <Link href="/admin/security" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center transition hover:border-amber-500/50">
          <div className="text-amber-500">Change Password</div>
        </Link>
      </div>
    </div>
  );
}