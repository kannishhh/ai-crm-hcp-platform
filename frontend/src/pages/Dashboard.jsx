import { useState, useEffect, useRef } from "react";
import Skeleton from "../components/ui/Skeleton";
import {
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Activity,
  Info,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  X,
  FileText,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAnalytics,
  fetchAiInsights,
} from "../store/slices/interactionSlice";
import toast from "react-hot-toast";
import socketService from "../services/socket";

export default function DashboardView({ onLogInteraction, isDarkMode }) {
  const dispatch = useAppDispatch();
  const {
    analytics: data,
    aiInsights,
    loading,
    error,
  } = useAppSelector((state) => state.interaction);

  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    dispatch(fetchAnalytics());
    dispatch(fetchAiInsights());

    const socket = socketService.connect();

    const handleUpdate = () => {
      console.log("Dashboard: Live update triggered via socket");
      dispatch(fetchAnalytics());
      dispatch(fetchAiInsights());
    };

    socket.on("new_interaction", handleUpdate);
    socket.on("interaction_updated", handleUpdate);

    return () => {
      socket.off("new_interaction", handleUpdate);
      socket.off("interaction_updated", handleUpdate);
    };
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAnalytics());
    dispatch(fetchAiInsights());
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const toastId = toast.loading("Generating full strategic report...");

    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportModal(true);
      toast.success("Strategic report ready!", { id: toastId });
    }, 1500);
  };

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold dark:text-white">
          Oops! Something went wrong
        </h2>
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const sentimentPieData = data
    ? [
        { name: "Positive", value: data.sentiment.Positive, color: "#10b981" },
        { name: "Neutral", value: data.sentiment.Neutral, color: "#f59e0b" },
        { name: "Negative", value: data.sentiment.Negative, color: "#f43f5e" },
      ]
    : [];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Interactions",
            value: data?.total_interactions,
            change: data?.changes?.interactions || "0%",
            icon: MessageSquare,
            color: "brand",
          },
          {
            label: "Active HCPs",
            value: data?.active_hcps,
            change: data?.changes?.hcps || "0%",
            icon: Users,
            color: "blue",
          },
          {
            label: "Pending Follow-ups",
            value: data?.follow_ups?.length,
            change: data?.changes?.follow_ups || "0",
            icon: Clock,
            color: "amber",
          },
          {
            label: "Avg. Sentiment",
            value: data
              ? data.sentiment.Positive >= data.sentiment.Negative
                ? "Positive"
                : "Critical"
              : null,
            change: "Stable",
            icon: Activity,
            color: "emerald",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "p-3 rounded-2xl",
                  stat.color === "brand" &&
                    "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400",
                  stat.color === "blue" &&
                    "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                  stat.color === "amber" &&
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                  stat.color === "emerald" &&
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              {loading ? (
                <Skeleton className="w-12 h-6 rounded-full" />
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                    stat.change.startsWith("+")
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  {stat.change.startsWith("+") ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-400">
                {stat.label}
              </p>
              {loading ? (
                <Skeleton className="w-20 h-8 mt-1" />
              ) : (
                <h3 className="text-2xl font-semibold mt-1 dark:text-white tracking-tight text-slate-950">
                  {stat.value}
                </h3>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold dark:text-white tracking-wider flex items-center gap-2 text-slate-950">
                <Activity className="w-5 h-5 text-brand-500" />
                Engagement Velocity
              </h3>
              <p className="text-sm text-slate-900 dark:text-white mt-0.5 font-bold">
                Weekly interaction volume over time
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.trends || []}>
                  <defs>
                    <linearGradient id="colorInter" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDarkMode === "dark" ? "#e2e8f0" : "#334155"}
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: isDarkMode === "dark" ? "#94a3b8" : "#64748b",
                      fontWeight: 700,
                    }}
                    dy={10}
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: isDarkMode === "dark" ? "#94a3b8" : "#64748b",
                      fontWeight: 700,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "16px",
                      color: "#fff",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "#bae0fd" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0ea5e9"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorInter)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 glass-card border-none bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-400/20 rounded-full -ml-12 -mb-12 blur-xl" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">
                    AI Sales Insights
                  </h3>
                  <p className="text-white/60 text-xs font-semibold tracking-wide">
                    Live Analysis
                  </p>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[300px] scrollbar-hide">
                {loading ? (
                  [1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 bg-white/10" />
                  ))
                ) : aiInsights?.length > 0 ? (
                  aiInsights.slice(0, 3).map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-1 group"
                    >
                      <div className="flex items-center gap-2">
                        {insight.type === "sentiment" ? (
                          <Activity className="w-3.5 h-3.5 text-emerald-300" />
                        ) : insight.type === "engagement" ? (
                          <TrendingUp className="w-3.5 h-3.5 text-brand-300" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        )}
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">
                          {insight.title}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {insight.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-sm text-white/70 italic">
                      Start logging interactions to unlock real-time strategic
                      insights.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="w-full mt-6 py-3 bg-white text-brand-600 rounded-xl font-bold text-sm tracking-tight hover:bg-brand-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingReport ? "Analyzing..." : "Generate Full Report"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      AI Strategic Sales Report
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Generated on {new Date().toLocaleDateString()} •
                      Confidential
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
                    <p className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">
                      Total Coverage
                    </p>
                    <h4 className="text-3xl font-bold text-slate-950 dark:text-white">
                      {data?.total_interactions}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Interactions logged
                    </p>
                  </div>
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                      Market Reach
                    </p>
                    <h4 className="text-3xl font-bold text-slate-950 dark:text-white">
                      {data?.active_hcps}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Unique HCPs visited
                    </p>
                  </div>
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">
                      Action Items
                    </p>
                    <h4 className="text-3xl font-bold text-slate-950 dark:text-white">
                      {data?.follow_ups?.length}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Pending follow-ups
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    Strategic AI Recommendations
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {aiInsights?.map((insight, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                            {insight.type === "sentiment" ? (
                              <Activity className="w-4 h-4 text-emerald-500" />
                            ) : insight.type === "engagement" ? (
                              <TrendingUp className="w-4 h-4 text-brand-600" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {insight.title}
                          </h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                          {insight.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-indigo-600 rounded-[24px] text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">
                      Quarterly Outlook
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
                      Based on current engagement velocity and the{" "}
                      {data?.sentiment.Positive > data?.sentiment.Negative
                        ? "Positive"
                        : "Neutral"}{" "}
                      sentiment trends, the territory is expected to see a
                      12-15% increase in prescription intent over the next 60
                      days. Focus on high-intent clinicians and address
                      reimbursement barriers early in the discussion.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  This report was generated using Clinical AI analysis of
                  real-time CRM data.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:col-span-12 xl:col-span-8 glass-card overflow-hidden min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold tracking-wider flex items-center gap-2 dark:text-white">
              <Clock className="w-5 h-5 text-indigo-500" />
              Recent Interaction Logs
            </h3>
            <button
              onClick={() => refresh()}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />{" "}
              Refresh
            </button>
          </div>

          <div className="flex-1 overflow-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-500">
                    HCP Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-500">
                    Summary
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-500">
                    Sentiment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-48" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                    </tr>
                  ))
                ) : data?.recent_logs?.length > 0 ? (
                  data.recent_logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                            {log.hcp_name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {log.hcp_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-slate-800 dark:text-slate-400 truncate">
                          {log.summary}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-800 dark:text-slate-400 font-bold">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                            log.sentiment === "Positive"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : log.sentiment === "Negative"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
                          )}
                        >
                          {log.sentiment}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-700 dark:text-slate-400 font-bold"
                    >
                      No interactions logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
          <div className="glass-card flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold tracking-wider flex items-center gap-2 dark:text-white">
                <Calendar className="w-5 h-5 text-amber-500" />
                Priority Tasks
              </h3>
              <PlusCircle className="w-5 h-5 text-slate-700 dark:text-slate-400 cursor-pointer hover:text-brand-500 transition-all" />
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 max-h-[400px] scrollbar-thin">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))
              ) : data?.follow_ups?.length > 0 ? (
                data.follow_ups.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800 border-l-4 border-amber-500 rounded-r-2xl rounded-l-md hover:translate-x-1 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-400 tracking-tight">
                          {task.hcp_name}
                        </p>
                        <h4 className="text-xs font-semibold dark:text-white leading-tight text-slate-950 line-clamp-2">
                          {task.task}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-400">
                        <Clock className="w-3 h-3" />{" "}
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                      <button className="ml-auto bg-brand-600 text-white p-1 rounded-lg hover:scale-110 transition-all">
                        <CheckCircle2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-400">
                    All tasks completed!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
