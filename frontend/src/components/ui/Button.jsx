import { cn } from "../../lib/utils";
import { forwardRef } from "react";

const Button = forwardRef(
  (
    { className, variant = "primary", size = "default", children, ...props },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 active:scale-[0.98]",
      secondary:
        "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]",
      outline:
        "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98]",
      ghost:
        "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors",
      dangerGhost:
        "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors",
    };

    const sizes = {
      default: "px-2 py-2",
      sm: "px-3 py-2 text-xs",
      lg: "px-6 py-4",
      icon: "p-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-xl font-semibold tracking-wide text-sm transition-all flex items-center justify-center gap-2",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
