export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-24 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-[220px,1fr]">
          <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
