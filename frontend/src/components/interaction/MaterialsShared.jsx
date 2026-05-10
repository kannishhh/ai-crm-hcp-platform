import { Share2, Plus, X } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import { cn } from "../../lib/utils";

const MATERIALS_LIST = [
  { id: 1, name: "Clinical Trial PDF - Study 402", type: "PDF" },
  { id: 2, name: "Product Monograph v2.1", type: "PDF" },
  { id: 3, name: "Safety Guidelines 2024", type: "Doc" },
  { id: 4, name: "Patient Assistance Program", type: "PDF" },
  { id: 5, name: "Comparative Study Deck", type: "Slides" },
  { id: 6, name: "Efficacy Reports Summary", type: "PDF" },
];

export default function MaterialsShared({
  selectedMaterials,
  setSelectedMaterials,
}) {
  const handleMaterialToggle = (mat) => {
    if (selectedMaterials.find((m) => m.id === mat.id)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m.id !== mat.id));
    } else {
      setSelectedMaterials([...selectedMaterials, mat]);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon={Share2}
        title="Assets & Materials Shared"
        iconClassName="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <Input
              type="text"
              placeholder="Search resources..."
              className="py-2.5 text-xs"
            />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 p-4">
            {MATERIALS_LIST.map((mat) => (
              <div
                key={mat.id}
                onClick={() => handleMaterialToggle(mat)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group",
                  selectedMaterials.find((m) => m.id === mat.id)
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                      selectedMaterials.find((m) => m.id === mat.id)
                        ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500",
                    )}
                  >
                    {mat.type}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {mat.name}
                  </span>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center transition-all",
                    selectedMaterials.find((m) => m.id === mat.id)
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-blue-100",
                  )}
                >
                  <Plus className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Selected Assets ({selectedMaterials.length})
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {selectedMaterials.length === 0 ? (
              <EmptyState
                icon={Share2}
                message="No materials selected"
                className="py-8"
              />
            ) : (
              selectedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-400">
                      {mat.type}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {mat.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleMaterialToggle(mat)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
