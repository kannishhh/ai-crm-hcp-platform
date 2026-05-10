import { useEffect, useState } from "react";
import Skeleton from "../components/ui/Skeleton";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
  fetchInteractions, 
  updateInteraction 
} from "../store/slices/interactionSlice";
import { analyzeInteraction } from "../store/slices/aiSlice";

export default function InteractionHistory() {
  const dispatch = useAppDispatch();
  const { interactions: history, loading } = useAppSelector((state) => state.interaction);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("All");
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [editTopics, setEditTopics] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const fetchHistory = () => dispatch(fetchInteractions());

  const handleEdit = (item) => {
    setEditingInteraction(item);
    setEditTopics(item.topics);
  };

  const handleUpdateInteraction = async () => {
    if (!editTopics.trim()) return;
    setIsUpdating(true);
    try {
      const aiData = await dispatch(analyzeInteraction({ topics: editTopics })).unwrap();

      await dispatch(updateInteraction({
        id: editingInteraction.id,
        payload: {
          hcp_name: aiData.hcp_name,
          sentiment: aiData.sentiment,
          topics: editTopics,
          followups: Array.isArray(aiData.followups) ? aiData.followups.join("\n") : aiData.followups,
          summary: aiData.summary,
        }
      })).unwrap();

      setEditingInteraction(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.hcp_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === "All" || item.sentiment === filterSentiment;
    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white text-slate-950">
            Interaction Repository
          </h1>
          <p className="text-slate-800 dark:text-slate-400 mt-1 font-bold">
            Historical audit of clinical engagements and AI insights
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search HCP or context..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500/20 outline-none transition-all w-full md:w-64 dark:text-white text-slate-950 shadow-sm"
            />
          </div>
          
          <select 
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer dark:text-white text-slate-950 shadow-sm"
          >
            <option value="All">All Sentiment</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
          
          <button 
            onClick={fetchHistory}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <RefreshCw className={cn("w-4 h-4 text-slate-600", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div key={item.id} className="glass-card p-0 overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/5 transition-all">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-black text-xl shadow-inner border border-brand-100 dark:border-brand-800">
                        {item.hcp_name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-black dark:text-white text-slate-950 uppercase tracking-tight">
                          {item.hcp_name}
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-400 uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-400 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm",
                          item.sentiment === "Positive"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                            : item.sentiment === "Negative"
                              ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
                              : "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                        )}
                      >
                        {item.sentiment} Sentiment
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                        <Sparkles className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Executive Summary</h3>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-bold">
                        {item.summary}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Follow-up Commitment</h3>
                      </div>
                      <div className="space-y-2">
                        {item.followups.split('\n').filter(f => f.trim()).map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-400 font-bold">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            {f.replace(/^[-\d.]\s*/, '')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full transcript available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance Verified</span>
                  </div>
                </div>
                <button className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest flex items-center gap-1 group/btn">
                  View full analysis <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">No interactions found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or filters to find specific engagement logs.</p>
            </div>
          </div>
        )}
      </div>

      {editingInteraction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 w-full max-w-2xl space-y-8 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black dark:text-white text-slate-950 tracking-tight uppercase">Edit Clinical Note</h2>
                <p className="text-sm text-slate-800 dark:text-slate-400 font-bold mt-1">Refine the interaction context for AI re-analysis</p>
              </div>
              <button
                onClick={() => setEditingInteraction(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest">Discussion Topics</label>
              <textarea
                rows={10}
                value={editTopics}
                onChange={(e) => setEditTopics(e.target.value)}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium leading-relaxed focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none resize-none dark:text-white text-slate-900 shadow-inner"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdateInteraction}
                disabled={isUpdating}
                className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Re-Analyze & Update
              </button>
              <button
                onClick={() => setEditingInteraction(null)}
                className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
