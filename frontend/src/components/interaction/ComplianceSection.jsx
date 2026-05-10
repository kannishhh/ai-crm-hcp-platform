import { ShieldCheck, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import Toggle from "../ui/Toggle";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "../../lib/utils";

export default function ComplianceSection({
  adverseEvent,
  setAdverseEvent,
  complianceReviewed,
  setComplianceReviewed,
  flaggedContent,
  complianceRisk,
  approvalStatus,
  setApprovalStatus,
}) {
  return (
    <Card className="border-l-4 border-l-emerald-500">
      <SectionHeader
        icon={ShieldCheck}
        title="Regulatory Compliance"
        iconClassName="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
        action={
          <>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={adverseEvent}
                onChange={(e) => setAdverseEvent(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-rose-500 transition-colors">
                Adverse Event Reported
              </span>
            </label>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <Toggle
              label="Compliance Review"
              checked={complianceReviewed}
              onChange={setComplianceReviewed}
            />
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                Medical / Legal Review
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 font-medium leading-relaxed">
                This interaction follows PhRMA guidelines. Narrative contains no
                unsupported claims or high-risk therapeutic wording.
              </p>
            </div>
          </div>
          {flaggedContent && (
            <div
              className={cn(
                "p-5 rounded-2xl border flex items-start gap-4",
                complianceRisk === "High"
                  ? "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
                  : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
              )}
            >
              <AlertTriangle
                className={cn(
                  "w-6 h-6 mt-1",
                  complianceRisk === "High"
                    ? "text-rose-600"
                    : "text-amber-600",
                )}
              />
              <div>
                <h4
                  className={cn(
                    "text-sm font-semibold",
                    complianceRisk === "High"
                      ? "text-rose-800 dark:text-rose-400"
                      : "text-amber-800 dark:text-amber-400",
                  )}
                >
                  {complianceRisk} Risk Detected
                </h4>
                <p
                  className={cn(
                    "text-xs mt-1 font-medium leading-relaxed",
                    complianceRisk === "High"
                      ? "text-rose-700 dark:text-rose-500"
                      : "text-amber-700 dark:text-amber-500",
                  )}
                >
                  {flaggedContent}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
            Approval Status
          </label>
          <div className="flex gap-2">
            {["Pending", "Approved", "Requires Review"].map((status) => (
              <button
                key={status}
                onClick={() => setApprovalStatus(status)}
                className={cn(
                  "flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all border",
                  approvalStatus === status
                    ? "bg-white dark:bg-slate-700 text-brand-600 border-slate-200 dark:border-slate-600 shadow-sm"
                    : "bg-transparent text-slate-500 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50",
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
