export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-14 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800" />)}
        </div>
      </div>
    </div>
  );
}
