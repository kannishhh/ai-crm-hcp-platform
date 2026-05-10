import { TrendingUp } from "lucide-react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "../../lib/utils";

const OUTCOMES = [
  "Product Interest",
  "Requested Clinical Data",
  "Follow-up Required",
  "No Interest",
  "Sample Requested",
  "Pricing Concern",
  "Positive Engagement",
  "Objection Raised",
  "Competitor Preferred",
];

export default function OutcomeSection({
  outcome,
  setOutcome,
  outcomePriority,
  setOutcomePriority,
  riskLevel,
  setRiskLevel,
  outcomeNotes,
  setOutcomeNotes,
}) {
  return (
    <Card>
      <SectionHeader
        icon={TrendingUp}
        title="Interaction Outcome"
        iconClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <Label>Primary Outcome</Label>
          <Select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            {OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Follow-up Priority</Label>
          <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            {["Low", "Medium", "High", "Critical"].map((p) => (
              <button
                key={p}
                onClick={() => setOutcomePriority(p)}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold rounded-xl transition-all",
                  outcomePriority === p
                    ? p === "Critical"
                      ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 shadow-sm border border-rose-200 dark:border-rose-800"
                      : "bg-white dark:bg-slate-700 shadow-sm text-amber-600 border border-slate-100 dark:border-slate-600"
                    : "text-slate-500",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Account Risk Level</Label>
          <Select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
          >
            <option>Low - Stable Engagement</option>
            <option>Medium - Exploring Competitors</option>
            <option>High - Unresponsive / At Risk</option>
          </Select>
        </div>

        <div className="md:col-span-3 space-y-3">
          <Label>Outcome Narrative</Label>
          <Textarea
            value={outcomeNotes}
            onChange={(e) => setOutcomeNotes(e.target.value)}
            placeholder="Final conclusions and specific commitments made during the interaction..."
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
}
