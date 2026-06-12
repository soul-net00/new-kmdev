import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminCounts } from "@/lib/data";
import { getAgencyCounts, WORKFLOW_STAGES } from "@/lib/agency";
import { currency } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [counts, agency] = await Promise.all([getAdminCounts(), getAgencyCounts()]);
  const maxStage = Math.max(1, ...Object.values(agency.byStage || {}));
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending Quotes", value: agency.pendingQuotes, href: "/admin/quotes" },
          { label: "Clients", value: agency.clients, href: "/admin/clients" },
          { label: "Active Projects", value: agency.projects, href: "/admin/clients" },
          { label: "Open Tickets", value: agency.openTickets, href: "/admin/clients" }
        ].map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="text-sm text-slate-500">{c.label}</div>
            <div className="mt-1 text-3xl font-bold text-emerald-500">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-sm text-slate-500">Pipeline Value</div>
          <div className="mt-1 text-2xl font-bold">{currency(agency.pipelineValue)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-sm text-slate-500">Collected</div>
          <div className="mt-1 text-2xl font-bold text-emerald-500">{currency(agency.collected)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-sm text-slate-500">Outstanding</div>
          <div className="mt-1 text-2xl font-bold text-amber-500">{currency(agency.outstanding)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <h3 className="mb-4 font-semibold">Projects by Workflow Stage</h3>
        {agency.projects === 0 ? (
          <p className="text-sm text-slate-500">No client projects yet.</p>
        ) : (
          <div className="space-y-2">
            {WORKFLOW_STAGES.filter((s) => (agency.byStage as any)[s]).map((stage) => {
              const value = (agency.byStage as any)[stage] || 0;
              return (
                <div key={stage} className="flex items-center gap-3 text-sm">
                  <span className="w-44 shrink-0 truncate text-slate-500">{stage}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(value / maxStage) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right font-semibold">{value}</span>
                </div>
              );
            })}
          </div>
        )}
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