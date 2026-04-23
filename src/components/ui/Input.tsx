import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, PropsWithChildren } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ children, className, ...props }: PropsWithChildren<InputProps>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </input>
  );
}