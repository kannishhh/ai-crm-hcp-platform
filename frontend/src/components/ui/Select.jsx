import { cn } from "../../lib/utils";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative group">
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all dark:text-white text-slate-950 appearance-none cursor-pointer pr-10 hover:bg-white dark:hover:bg-slate-700",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-brand-500 transition-colors">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
});
Select.displayName = "Select";
export default Select;
