import { cn } from "../../lib/utils";

export default function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    brand: "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-100 dark:border-brand-800",
    success: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    warning: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    error: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
