import { useEffect, useState } from "react";
import { History, User, Bot, ArrowRight, Clock } from "lucide-react";
import API from "../../services/api";
import { cn } from "../../lib/utils";

import socketService from "../../services/socket";

export default function EditTimeline({ interactionId }) {
  const [edits, setEdits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (interactionId) {
      fetchEdits();
      
      const socket = socketService.getSocket();
      if (socket) {
        socket.on("interaction_updated", (data) => {
          if (data.interaction_id === interactionId) {
            fetchEdits();
          }
        });
      }
      
      return () => {
        if (socket) socket.off("interaction_updated");
      };
    }
  }, [interactionId]);

  const fetchEdits = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/history/${interactionId}/edits`);
      setEdits(response.data);
    } catch (error) {
      console.error("Failed to fetch edits:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!interactionId) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2 uppercase tracking-wider">
          <History className="w-4 h-4 text-brand-500" />
          Audit Timeline
        </h3>
        {loading && <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent dark:before:from-slate-800 dark:before:via-slate-800">
        {edits.length > 0 ? (
          edits.map((edit, idx) => (
            <div key={edit.id} className="relative flex items-start gap-6 group">
              <div className={cn(
                "absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm z-10 transition-transform group-hover:scale-110",
                edit.changed_by === "AI Genie" 
                  ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}>
                {edit.changed_by === "AI Genie" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className="pl-12 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                    {edit.field.replace("_", " ")} Updated
                  </p>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" />
                    {new Date(edit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-medium text-slate-500 line-through truncate max-w-[100px]">
                    {edit.old_value || "Empty"}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 truncate">
                    {edit.new_value}
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-semibold text-slate-500 italic">
                  Changed by {edit.changed_by}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="pl-12 py-4">
            <p className="text-xs font-bold text-slate-500 italic">No edits recorded for this interaction yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
