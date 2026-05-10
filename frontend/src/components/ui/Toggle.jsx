import { cn } from "../../lib/utils";

export default function Toggle({ checked, onChange, label, className }) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer group", className)}>
      {label && (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative shrink-0",
          checked ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
            checked ? "left-7" : "left-1"
          )}
        />
      </button>
    </label>
  );
}
