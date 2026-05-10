import { cn } from "../../lib/utils";
import { forwardRef } from "react";

const Textarea = forwardRef(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="w-4 h-4 absolute left-4 top-4 text-slate-700 dark:text-slate-400" />
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white text-slate-950 placeholder:text-slate-500 resize-none",
          Icon ? "pl-11 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";
export default Textarea;
