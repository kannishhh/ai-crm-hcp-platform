import { cn } from "../../lib/utils";

export default function EmptyState({ icon: Icon, message, className }) {
  return (
    <div className={cn("py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3 text-center px-6", className)}>
      <Icon className="w-8 h-8 opacity-40" />
      <p className="text-sm font-medium max-w-xs mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}
