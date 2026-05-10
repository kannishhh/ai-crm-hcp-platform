import { Users, Calendar, MapPin, Plus, X, Clock } from "lucide-react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";
import HcpSelector from "./HcpSelector";
import { cn } from "../../lib/utils";

const INTERACTION_TYPES = [
  "Meeting",
  "Call",
  "Email",
  "Webinar",
  "Conference",
  "Lunch & Learn",
];
const LOCATIONS = ["Clinic", "Hospital", "Office", "Virtual", "Other"];

export default function InteractionMetadata({
  hcps,
  selectedHcp,
  setSelectedHcp,
  searchTerm,
  setSearchTerm,
  isDropdownOpen,
  setIsDropdownOpen,
  interactionType,
  setInteractionType,
  meetingMode,
  setMeetingMode,
  interactionDate,
  setInteractionDate,
  interactionTime,
  setInteractionTime,
  location,
  setLocation,
  duration,
  setDuration,
  attendees,
  newAttendee,
  setNewAttendee,
  addAttendee,
  removeAttendee,
}) {
  return (
    <Card>
      <SectionHeader
        icon={Users}
        title="Engagement Metadata"
        iconClassName="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HcpSelector
          hcps={hcps}
          selectedHcp={selectedHcp}
          setSelectedHcp={setSelectedHcp}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />

        <div className="space-y-3">
          <Label>Interaction Channel</Label>
          <Select
            value={interactionType}
            onChange={(e) => setInteractionType(e.target.value)}
          >
            {INTERACTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Meeting Mode</Label>
          <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            {["In-Person", "Virtual"].map((mode) => (
              <button
                key={mode}
                onClick={() => setMeetingMode(mode)}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold rounded-xl transition-all",
                  meetingMode === mode
                    ? "bg-white dark:bg-slate-700 shadow-sm text-brand-600 border border-slate-100 dark:border-slate-600"
                    : "text-slate-500",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Date & Time</Label>
          <div className="grid grid-cols-1 gap-2">
            <Input
              type="date"
              icon={Calendar}
              value={interactionDate}
              onChange={(e) => setInteractionDate(e.target.value)}
            />
            <Input
              type="time"
              icon={Clock}
              value={interactionTime}
              onChange={(e) => setInteractionTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Location & Duration</Label>
          <div className="grid grid-cols-1 gap-2">
            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
            <div className="relative">
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="5"
                step="5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 pointer-events-none">
                min
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>External Attendees</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add attendee..."
              value={newAttendee}
              onChange={(e) => setNewAttendee(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAttendee()}
            />
            <Button variant="secondary" onClick={addAttendee} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {attendees.map((a, i) => (
              <Badge key={i} variant="brand" className="gap-1.5">
                {a}
                <X
                  className="w-2.5 h-2.5 cursor-pointer"
                  onClick={() => removeAttendee(i)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
