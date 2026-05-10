import { cn } from "../../lib/utils";

export default function Card({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 transition-all",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
