import { cn } from "../../lib/utils";
import { forwardRef } from "react";

const Input = forwardRef(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-400" />
      )}
      <input
        ref={ref}
        className={cn(
          "w-full py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all dark:text-white text-slate-950 placeholder:text-slate-500 hover:bg-white dark:hover:bg-slate-700",
          Icon ? "pl-11 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";
export default Input;
