import { cn } from "../../lib/utils";

export default function Label({ children, className, ...props }) {
  return (
    <label
      className={cn(
        "text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
