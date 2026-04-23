import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">404</p>
      <h1 className="mt-3 text-4xl font-black">Page not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="mt-6 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Go home</Link>
    </div>
  );
}
