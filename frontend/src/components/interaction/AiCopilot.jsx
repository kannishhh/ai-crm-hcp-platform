import {
  Bot,
  PlusCircle,
  TrendingUp,
  Target,
  RefreshCw,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useAppSelector } from "../../store/hooks";
import ReactMarkdown from "react-markdown";

export default function AiCopilot({
  engagementScore,
  buyingIntentScore,
  chatInput,
  setChatInput,
  handleSendMessage,
}) {
  const { messages, isProcessing: isAiProcessing } = useAppSelector(
    (state) => state.ai,
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex-1 flex flex-col p-0 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center relative border border-slate-100 dark:border-slate-700">
            <Bot className="w-8 h-8 text-brand-600" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[4px] border-white dark:border-slate-900" />
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white text-base tracking-tight">
              Genie AI Copilot
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-emerald-600 font-semibold italic">
                Active Clinical Oversight
              </p>
            </div>
          </div>
        </div>
        <button className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-brand-600 shadow-sm transition-all">
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-indigo-50/30 dark:bg-indigo-900/5 border-b border-indigo-100/50 dark:border-indigo-800/50 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-400">
            Engagement Score
          </p>
          <div className="flex items-end justify-between mt-1">
            <h4 className="text-2xl font-bold text-indigo-600">
              {engagementScore}%
            </h4>
            <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-400">
            Buying Intent
          </p>
          <div className="flex items-end justify-between mt-1">
            <h4 className="text-2xl font-bold text-brand-600">
              {buyingIntentScore}%
            </h4>
            <Target className="w-5 h-5 text-brand-400 mb-1" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col gap-2",
                msg.role === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[90%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm font-medium"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700",
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-li:my-1">
                    {msg.type === "edit_confirmation" ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            ✓
                          </span>
                          <span>Update Successful</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Field Updated
                          </p>
                          <p className="font-semibold text-slate-900 dark:text-white capitalize">
                            {msg.data?.updates
                              ? Object.keys(msg.data.updates)
                                  .join(", ")
                                  .replace("_", " ")
                              : "Interaction"}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 italic mt-1">
                          CRM record and dashboard synced in realtime.
                        </p>
                      </div>
                    ) : msg.type === "analysis_result" ? (
                      <div className="flex flex-col gap-4">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.data && (
                          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                            {msg.data.sentiment && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                  Sentiment
                                </span>
                                <span
                                  className={cn(
                                    "font-bold",
                                    msg.data.sentiment === "Positive"
                                      ? "text-emerald-600"
                                      : msg.data.sentiment === "Negative"
                                        ? "text-red-600"
                                        : "text-slate-600",
                                  )}
                                >
                                  {msg.data.sentiment}
                                </span>
                              </div>
                            )}
                            {msg.data.compliance_risk && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                  Compliance Risk
                                </span>
                                <span
                                  className={cn(
                                    "font-bold px-2 py-0.5 rounded",
                                    msg.data.compliance_risk === "High"
                                      ? "bg-red-100 text-red-700"
                                      : msg.data.compliance_risk === "Medium"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-emerald-100 text-emerald-700",
                                  )}
                                >
                                  {msg.data.compliance_risk}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium px-2 uppercase tracking-wider">
                {msg.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isAiProcessing && (
          <div className="flex gap-3 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <RefreshCw className="w-4 h-4 text-brand-500 animate-spin" />
            <span className="text-sm text-brand-600 font-semibold italic">
              Analyzing clinical context...
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask Genie for insights..."
            className="flex-1 w-[60%] bg-transparent border-none outline-none px-3 text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
