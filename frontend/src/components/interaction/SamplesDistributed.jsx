import { Package, Plus, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import SectionHeader from "../ui/SectionHeader";
import EmptyState from "../ui/EmptyState";

export default function SamplesDistributed({ samples, setSamples }) {
  const addSample = () => {
    setSamples([...samples, { name: "", quantity: 1, lotNumber: "" }]);
  };

  const updateSample = (index, field, value) => {
    const newSamples = [...samples];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  return (
    <Card>
      <SectionHeader
        icon={Package}
        title="Samples Distributed"
        iconClassName="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        action={
          <Button
            variant="ghost"
            onClick={addSample}
            className="text-brand-600"
          >
            <Plus className="w-4 h-4" /> Add Sample
          </Button>
        }
      />

      <div className="space-y-4">
        {samples.map((sample, i) => (
          <div
            key={i}
            className="flex gap-4 items-end bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex-1 space-y-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                value={sample.product}
                onChange={(e) => updateSample(i, "product", e.target.value)}
                placeholder="e.g. MigraHeal 100mg"
              />
            </div>
            <div className="w-32 space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={sample.quantity}
                onChange={(e) =>
                  updateSample(i, "quantity", Number(e.target.value))
                }
                min="1"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Lot/Batch Number</Label>
              <Input
                type="text"
                value={sample.batch}
                onChange={(e) => updateSample(i, "batch", e.target.value)}
                placeholder="Required for compliance"
              />
            </div>
            <Button
              variant="dangerGhost"
              onClick={() => setSamples(samples.filter((_, idx) => idx !== i))}
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {samples.length === 0 && (
          <EmptyState
            icon={Package}
            message="No samples logged for this interaction"
          />
        )}
      </div>
    </Card>
  );
}
