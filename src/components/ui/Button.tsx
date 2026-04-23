import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, className, variant = "primary", ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
        variant === "primary" && "bg-emerald-500 text-slate-950 hover:bg-emerald-600",
        variant === "secondary" && "border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
        variant === "ghost" && "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
