import { Calendar, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import EmptyState from "../ui/EmptyState";
import { cn } from "../../lib/utils";

export default function FollowupPlanner({
  followupTasks,
  setFollowupTasks,
  aiSuggestions,
}) {
  const addFollowup = () => {
    setFollowupTasks([...followupTasks, ""]);
  };

  const addAiSuggestion = (suggestion) => {
    if (!followupTasks.includes(suggestion)) {
      setFollowupTasks([...followupTasks, suggestion]);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon={Calendar}
        title="Follow-up Planner"
        iconClassName="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
        action={
          <Button
            variant="ghost"
            onClick={addFollowup}
            className="text-brand-600"
          >
            <Plus className="w-4 h-4" /> Add Custom Task
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            AI Recommended Next Steps
          </h3>
          <div className="space-y-3">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 bg-white dark:bg-slate-800 border rounded-xl flex items-start gap-3 transition-all",
                    followupTasks.includes(suggestion)
                      ? "border-emerald-200 dark:border-emerald-800/50"
                      : "border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700",
                  )}
                >
                  <button
                    onClick={() => addAiSuggestion(suggestion)}
                    className={cn(
                      "mt-0.5 shrink-0 transition-colors",
                      followupTasks.includes(suggestion)
                        ? "text-emerald-500 cursor-default"
                        : "text-slate-300 dark:text-slate-600 hover:text-brand-500",
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Calendar}
                message="No AI suggestions available. Analyze narrative to generate."
                className="py-6"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Committed Action Items
          </h3>
          {followupTasks.map((task, i) => (
            <div key={i} className="flex gap-2 items-center group">
              <Input
                type="text"
                value={task}
                onChange={(e) => {
                  const newTasks = [...followupTasks];
                  newTasks[i] = e.target.value;
                  setFollowupTasks(newTasks);
                }}
                placeholder="Enter specific follow-up action..."
                className="bg-white dark:bg-slate-900"
              />
              <Button
                variant="dangerGhost"
                onClick={() =>
                  setFollowupTasks(followupTasks.filter((_, idx) => idx !== i))
                }
                size="icon"
                className="opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {followupTasks.length === 0 && (
            <EmptyState icon={Calendar} message="No tasks planned" />
          )}
        </div>
      </div>
    </Card>
  );
}
