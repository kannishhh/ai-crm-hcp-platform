import { cn } from "../../lib/utils";

export default function SectionHeader({ icon: Icon, title, className, iconClassName, action }) {
  return (
    <div className={cn("flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800", className)}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl", iconClassName)}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-semibold dark:text-white text-slate-950 tracking-wide">
          {title}
        </h2>
      </div>
      {action && <div className="flex items-center gap-4">{action}</div>}
    </div>
  );
}
