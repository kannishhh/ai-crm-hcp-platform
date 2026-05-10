import { FileText, Sparkles, Target, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "../../lib/utils";

const INTEREST_LEVELS = ["High", "Medium", "Low", "None"];

export default function ClinicalDiscussion({
  topics,
  setTopics,
  clinicalInsights,
  setClinicalInsights,
  objections,
  setObjections,
  competitorMentions,
  setCompetitorMentions,
  interestLevel,
  setInterestLevel,
  prescriptionIntent,
  setPrescriptionIntent,
  patientConcerns,
  setPatientConcerns,
  sentiment,
  handleAiAnalyze,
}) {
  return (
    <Card>
      <SectionHeader
        icon={FileText}
        title="Clinical Discussion"
        iconClassName="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
        action={
          <div className="flex items-center gap-4">
            {sentiment && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Sentiment:
                </span>
                <span
                  className={cn(
                    "text-xs font-bold",
                    sentiment === "Positive"
                      ? "text-emerald-600"
                      : sentiment === "Negative"
                        ? "text-rose-600"
                        : "text-slate-600",
                  )}
                >
                  {sentiment}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleAiAnalyze}
              className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
            >
              <Sparkles className="w-4 h-4" /> AI Enhancement Engine
            </Button>
          </div>
        }
      />

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            Interaction Narrative{" "}
            <span className="text-xs font-normal text-slate-500">
              Captured via clinical notes or AI transcription
            </span>
          </Label>
          <Textarea
            rows={5}
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="Enter the full clinical narrative here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label>Clinical Insights & Objections</Label>
            <div className="space-y-4">
              <Textarea
                icon={Target}
                value={clinicalInsights}
                onChange={(e) => setClinicalInsights(e.target.value)}
                placeholder="Key insights..."
              />
              <Textarea
                icon={AlertTriangle}
                value={objections}
                onChange={(e) => setObjections(e.target.value)}
                placeholder="HCP objections..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Interest & Buying Intent</Label>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={interestLevel}
                  onChange={(e) => setInterestLevel(e.target.value)}
                >
                  {INTEREST_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
                <Select
                  value={prescriptionIntent}
                  onChange={(e) => setPrescriptionIntent(e.target.value)}
                >
                  <option>Likely</option>
                  <option>Neutral</option>
                  <option>Unlikely</option>
                  <option>Unknown</option>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Competitor Activity</Label>
              <Input
                type="text"
                value={competitorMentions}
                onChange={(e) => setCompetitorMentions(e.target.value)}
                placeholder="Which competitor drugs were mentioned?"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
