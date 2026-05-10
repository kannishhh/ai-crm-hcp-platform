import {
  History,
  CheckCircle2,
  Share2,
  Calendar,
  FileText,
} from "lucide-react";
import { useAppSelector } from "../../store/hooks";

export default function ActivityFeed() {
  const { interactions: recentLogs } = useAppSelector(
    (state) => state.interaction,
  );
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col flex-1 p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <History className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-semibold dark:text-white text-slate-950">
          HCP Activity Feed
        </h3>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
        {recentLogs.length > 0 ? (
          recentLogs.slice(0, 10).map((log, i) => (
            <div key={log.id || i} className="flex gap-4 relative group">
              {i !== recentLogs.slice(0, 10).length - 1 && (
                <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-200 transition-colors" />
              )}
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 z-10 group-hover:border-brand-500 transition-all">
                {log.interaction_type === "Meeting" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : log.interaction_type === "Call" ? (
                  <Share2 className="w-4 h-4 text-blue-500" />
                ) : (
                  <Calendar className="w-4 h-4 text-indigo-500" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {log.interaction_type} with {log.hcp_name}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium leading-relaxed max-w-[200px] line-clamp-2">
                  {log.summary || "No summary provided."}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(log.created_at).toLocaleDateString()} •{" "}
                  {log.sentiment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-500">No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
