import { useState, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchHcps } from "../store/slices/hcpSlice";
import {
  fetchInteractions,
  saveInteraction,
} from "../store/slices/interactionSlice";
import {
  analyzeInteraction,
  addMessage,
  clearMessages,
  setAiProcessing,
} from "../store/slices/aiSlice";
import { addNotification } from "../store/slices/notificationSlice";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import InteractionMetadata from "../components/interaction/InteractionMetadata";
import ClinicalDiscussion from "../components/interaction/ClinicalDiscussion";
import OutcomeSection from "../components/interaction/OutcomeSection";
import MaterialsShared from "../components/interaction/MaterialsShared";
import SamplesDistributed from "../components/interaction/SamplesDistributed";
import FollowupPlanner from "../components/interaction/FollowupPlanner";
import ComplianceSection from "../components/interaction/ComplianceSection";
import AiCopilot from "../components/interaction/AiCopilot";
import ActivityFeed from "../components/interaction/ActivityFeed";
import EditTimeline from "../components/interaction/EditTimeline";

const INTERACTION_TYPES = [
  "Meeting",
  "Call",
  "Email",
  "Webinar",
  "Conference",
  "Lunch & Learn",
];
const LOCATIONS = ["Clinic", "Hospital", "Office", "Virtual", "Other"];
const INTEREST_LEVELS = ["High", "Medium", "Low", "None"];
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

const MATERIALS_LIST = [
  { id: 1, name: "Clinical Trial PDF - Study 402", type: "PDF" },
  { id: 2, name: "Product Monograph v2.1", type: "PDF" },
  { id: 3, name: "Safety Guidelines 2024", type: "Doc" },
  { id: 4, name: "Patient Assistance Program", type: "PDF" },
  { id: 5, name: "Comparative Study Deck", type: "Slides" },
  { id: 6, name: "Efficacy Reports Summary", type: "PDF" },
];

export default function LogInteraction() {
  const dispatch = useAppDispatch();
  const { hcps } = useAppSelector((state) => state.hcp);
  const { interactions: recentHistory } = useAppSelector(
    (state) => state.interaction,
  );
  const { lastSavedId } = useAppSelector((state) => state.interaction);
  const { messages, isProcessing: isAiProcessing } = useAppSelector(
    (state) => state.ai,
  );

  const [selectedHcp, setSelectedHcp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [interactionType, setInteractionType] = useState("Meeting");
  const [interactionDate, setInteractionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [interactionTime, setInteractionTime] = useState("10:00");
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState("Clinic");
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState("");
  const [meetingMode, setMeetingMode] = useState("In-Person");

  const [topics, setTopics] = useState("");
  const [clinicalInsights, setClinicalInsights] = useState("");
  const [objections, setObjections] = useState("");
  const [competitorMentions, setCompetitorMentions] = useState("");
  const [interestLevel, setInterestLevel] = useState("Medium");
  const [prescriptionIntent, setPrescriptionIntent] = useState("Likely");
  const [patientConcerns, setPatientConcerns] = useState("");

  const [outcome, setOutcome] = useState("Positive Engagement");
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [outcomePriority, setOutcomePriority] = useState("Medium");
  const [riskLevel, setRiskLevel] = useState("Low");

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [samples, setSamples] = useState([]);

  const [followupTasks, setFollowupTasks] = useState([]);

  const [complianceReviewed, setComplianceReviewed] = useState(false);
  const [adverseEvent, setAdverseEvent] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [complianceRisk, setComplianceRisk] = useState("Low");
  const [flaggedContent, setFlaggedContent] = useState("");

  const [sentiment, setSentiment] = useState("Neutral");
  const [summary, setSummary] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [engagementScore, setEngagementScore] = useState(0);
  const [buyingIntentScore, setBuyingIntentScore] = useState(0);
  const [chatInput, setChatInput] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchHcps());
    dispatch(fetchInteractions());

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  const handleAiAnalyze = async () => {
    if (!topics.trim()) return;
    try {
      const result = await dispatch(analyzeInteraction({ topics })).unwrap();

      if (!result || !result.data) return;
      const data = result.data;

      setSentiment(data.sentiment || "Neutral");
      setSummary(data.summary || "");
      setAiSuggestions(Array.isArray(data.followups) ? data.followups : []);
      setEngagementScore(data.engagement_score || 0);
      setBuyingIntentScore(data.buying_intent_score || 0);

      if (data.clinical_insights) setClinicalInsights(data.clinical_insights);
      if (data.objections) setObjections(data.objections);
      if (data.competitor_mentions)
        setCompetitorMentions(data.competitor_mentions);
      if (data.patient_concerns) setPatientConcerns(data.patient_concerns);
      if (data.prescription_intent)
        setPrescriptionIntent(data.prescription_intent);
      if (data.interest_level) setInterestLevel(data.interest_level);
      if (data.compliance_risk) setComplianceRisk(data.compliance_risk);

      if (data.flagged_content && data.flagged_content.length > 0) {
        const flagText = Array.isArray(data.flagged_content)
          ? data.flagged_content.join(", ")
          : data.flagged_content;
        setFlaggedContent(flagText);
        dispatch(
          addNotification({
            type: "compliance",
            message: `Compliance Risk: ${data.compliance_risk || "Detected"}`,
          }),
        );
      }

      if (data.interaction_type) setInteractionType(data.interaction_type);
      if (data.meeting_mode) setMeetingMode(data.meeting_mode);
      if (data.location) setLocation(data.location);
      if (data.duration) setDuration(data.duration);
      if (data.attendees && Array.isArray(data.attendees))
        setAttendees(data.attendees);
      if (data.outcome) setOutcome(data.outcome);
      if (data.outcome_priority) setOutcomePriority(data.outcome_priority);
      if (data.outcome_notes) setOutcomeNotes(data.outcome_notes);
      if (data.approval_status) setApprovalStatus(data.approval_status);
      if (data.risk_level) setRiskLevel(data.risk_level);
      if (data.adverse_event !== undefined) setAdverseEvent(data.adverse_event);

      if (data.materials_shared && Array.isArray(data.materials_shared)) {
        const matched = MATERIALS_LIST.filter((m) =>
          data.materials_shared.some(
            (dm) =>
              dm.toLowerCase().includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().includes(dm.toLowerCase()),
          ),
        );
        setSelectedMaterials(matched);
      }

      if (data.followup_tasks && Array.isArray(data.followup_tasks)) {
        const taskStrings = data.followup_tasks.map((t) =>
          typeof t === "object"
            ? `${t.task || ""} ${t.due_date ? `(Due: ${t.due_date})` : ""}`.trim()
            : t,
        );
        setFollowupTasks(taskStrings);
      }

      if (data.hcp_name) {
        const found = hcps.find(
          (h) =>
            h.name.toLowerCase().trim() === data.hcp_name.toLowerCase().trim(),
        );
        if (found) {
          setSelectedHcp(found);
          setSearchTerm(found.name);
        } else {
          setSelectedHcp({ id: "ai-detected", name: data.hcp_name });
          setSearchTerm(data.hcp_name);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveInteraction = async () => {
    if (!selectedHcp || !topics) {
      toast.error("Please complete the required fields (HCP and Narrative).");
      return;
    }

    const syncToast = toast.loading("Syncing interaction to CRM...");

    try {
      const payload = {
        hcp_name: selectedHcp.name,
        topics,
        sentiment,
        summary,
        followups: aiSuggestions.join("\n"),
        interaction_type: interactionType,
        duration,
        location,
        attendees: JSON.stringify(attendees),
        meeting_mode: meetingMode,
        clinical_insights: Array.isArray(clinicalInsights)
          ? clinicalInsights.join("\n")
          : clinicalInsights,
        objections: Array.isArray(objections)
          ? objections.join("\n")
          : objections,
        competitor_mentions: Array.isArray(competitorMentions)
          ? competitorMentions.join(", ")
          : competitorMentions,
        interest_level: interestLevel,
        prescription_intent: prescriptionIntent,
        engagement_score: engagementScore,
        buying_intent_score: buyingIntentScore,
        outcome,
        outcome_notes: outcomeNotes,
        outcome_priority: outcomePriority,
        risk_level: riskLevel,
        materials_shared: JSON.stringify(selectedMaterials),
        samples_distributed: JSON.stringify(samples),
        followup_tasks: JSON.stringify(followupTasks),
        compliance_reviewed: complianceReviewed,
        approval_status: approvalStatus,
        adverse_event: adverseEvent,
        patient_concerns: Array.isArray(patientConcerns)
          ? patientConcerns.join("\n")
          : patientConcerns,
      };

      await dispatch(saveInteraction(payload)).unwrap();

      toast.success("Interaction logged successfully in CRM", {
        id: syncToast,
      });

      dispatch(fetchHcps());

      setTopics("");
      setSelectedHcp(null);
      setSearchTerm("");
      setSummary("");
      setAiSuggestions([]);
      setAttendees([]);
      setSamples([]);
      setSelectedMaterials([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync with CRM. Please check your connection.", {
        id: syncToast,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");

    dispatch(
      addMessage({
        role: "user",
        content: userMsg,
        timestamp: new Date().toLocaleTimeString(),
      }),
    );

    try {
      const context = {
        current_interaction_id: lastSavedId,
        hcp_name: selectedHcp?.name,
        interaction_type: interactionType,
        topics,
        summary,
        sentiment,
        interest_level: interestLevel,
        engagement_score: engagementScore,
        buying_intent_score: buyingIntentScore,
        compliance_risk: complianceRisk,
      };

      const result = await dispatch(
        analyzeInteraction({
          user_question: userMsg,
          context: context,
          history: messages,
        }),
      ).unwrap();

      if (result && result.data) {
        const ext = result.data;

        if (ext.sentiment) setSentiment(ext.sentiment);
        if (ext.summary) setSummary(ext.summary);
        if (ext.clinical_insights) setClinicalInsights(ext.clinical_insights);
        if (ext.objections) setObjections(ext.objections);
        if (ext.competitor_mentions)
          setCompetitorMentions(ext.competitor_mentions);
        if (ext.interest_level) setInterestLevel(ext.interest_level);
        if (ext.engagement_score) setEngagementScore(ext.engagement_score);
        if (ext.buying_intent_score)
          setBuyingIntentScore(ext.buying_intent_score);
        if (ext.compliance_risk) setComplianceRisk(ext.compliance_risk);
        if (ext.followups) setAiSuggestions(ext.followups);

        if (ext.materials_shared && Array.isArray(ext.materials_shared)) {
          const matched = MATERIALS_LIST.filter((m) =>
            ext.materials_shared.some(
              (dm) =>
                dm.toLowerCase().includes(m.name.toLowerCase()) ||
                m.name.toLowerCase().includes(dm.toLowerCase()),
            ),
          );
          setSelectedMaterials(matched);
        }

        if (ext.followup_tasks && Array.isArray(ext.followup_tasks)) {
          const taskStrings = ext.followup_tasks.map((t) =>
            typeof t === "object"
              ? `${t.task || ""} ${t.due_date ? `(Due: ${t.due_date})` : ""}`.trim()
              : t,
          );
          setFollowupTasks(taskStrings);
        }

        if (ext.outcome) setOutcome(ext.outcome);
        if (ext.outcome_priority) setOutcomePriority(ext.outcome_priority);
        if (ext.outcome_notes) setOutcomeNotes(ext.outcome_notes);
        if (ext.approval_status) setApprovalStatus(ext.approval_status);

        if (!topics && ext.cleaned_narrative) {
          setTopics(ext.cleaned_narrative);
        } else if (!topics) {
          setTopics(userMsg);
        }

        if (ext.updates) {
          const updates = ext.updates;
          if (updates.sentiment) setSentiment(updates.sentiment);
          if (updates.interest_level) setInterestLevel(updates.interest_level);
          if (updates.outcome) setOutcome(updates.outcome);
          if (updates.outcome_priority)
            setOutcomePriority(updates.outcome_priority);
          if (updates.approval_status) setApprovalStatus(updates.approval_status);
          if (updates.buying_intent_score)
            setBuyingIntentScore(updates.buying_intent_score);
          if (updates.engagement_score)
            setEngagementScore(updates.engagement_score);
          if (updates.clinical_insights)
            setClinicalInsights(updates.clinical_insights);
          if (updates.objections) setObjections(updates.objections);

          if (
            updates.materials_shared &&
            Array.isArray(updates.materials_shared)
          ) {
            const matched = MATERIALS_LIST.filter((m) =>
              updates.materials_shared.some(
                (dm) =>
                  dm.toLowerCase().includes(m.name.toLowerCase()) ||
                  m.name.toLowerCase().includes(dm.toLowerCase()),
              ),
            );
            setSelectedMaterials(matched);
          }
        }

        if (ext.hcp_name) {
          const found = hcps.find(
            (h) =>
              h.name.toLowerCase().trim() === ext.hcp_name.toLowerCase().trim(),
          );
          if (found) {
            setSelectedHcp(found);
            setSearchTerm(found.name);
          } else {
            setSelectedHcp({ id: "ai-detected", name: ext.hcp_name });
            setSearchTerm(ext.hcp_name);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setAiProcessing(false));
    }
  };

  const addAttendee = () => {
    if (newAttendee.trim()) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee("");
    }
  };

  const removeAttendee = (index) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const addSample = () => {
    setSamples([
      ...samples,
      { product: "", quantity: 1, batch: "", expiry: "" },
    ]);
  };

  const updateSample = (index, field, value) => {
    const newSamples = [...samples];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  return (
    <div className="max-w-[1700px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pb-20">
      <div className="xl:col-span-8 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
              Interaction Workspace
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Enterprise clinical engagement logger • Session ID: CRM-
              {Math.floor(Math.random() * 9000) + 1000}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:flex"
              onClick={() => window.location.reload()}
            >
              Discard Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveInteraction}
              disabled={isAiProcessing}
            >
              {isAiProcessing ? "Syncing..." : "Sync to CRM"}
            </Button>
          </div>
        </div>

        <InteractionMetadata
          hcps={hcps}
          selectedHcp={selectedHcp}
          setSelectedHcp={setSelectedHcp}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          interactionType={interactionType}
          setInteractionType={setInteractionType}
          meetingMode={meetingMode}
          setMeetingMode={setMeetingMode}
          interactionDate={interactionDate}
          setInteractionDate={setInteractionDate}
          interactionTime={interactionTime}
          setInteractionTime={setInteractionTime}
          location={location}
          setLocation={setLocation}
          duration={duration}
          setDuration={setDuration}
          attendees={attendees}
          newAttendee={newAttendee}
          setNewAttendee={setNewAttendee}
          addAttendee={addAttendee}
          removeAttendee={removeAttendee}
        />

        <ClinicalDiscussion
          topics={topics}
          setTopics={setTopics}
          clinicalInsights={clinicalInsights}
          setClinicalInsights={setClinicalInsights}
          objections={objections}
          setObjections={setObjections}
          competitorMentions={competitorMentions}
          setCompetitorMentions={setCompetitorMentions}
          interestLevel={interestLevel}
          setInterestLevel={setInterestLevel}
          prescriptionIntent={prescriptionIntent}
          setPrescriptionIntent={setPrescriptionIntent}
          patientConcerns={patientConcerns}
          setPatientConcerns={setPatientConcerns}
          sentiment={sentiment}
          handleAiAnalyze={handleAiAnalyze}
        />

        <OutcomeSection
          outcome={outcome}
          setOutcome={setOutcome}
          outcomePriority={outcomePriority}
          setOutcomePriority={setOutcomePriority}
          riskLevel={riskLevel}
          setRiskLevel={setRiskLevel}
          outcomeNotes={outcomeNotes}
          setOutcomeNotes={setOutcomeNotes}
        />

        <MaterialsShared
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
        />

        <SamplesDistributed samples={samples} setSamples={setSamples} />

        <FollowupPlanner
          followupTasks={followupTasks}
          setFollowupTasks={setFollowupTasks}
          aiSuggestions={aiSuggestions}
        />

        <ComplianceSection
          adverseEvent={adverseEvent}
          setAdverseEvent={setAdverseEvent}
          complianceReviewed={complianceReviewed}
          setComplianceReviewed={setComplianceReviewed}
          flaggedContent={flaggedContent}
          complianceRisk={complianceRisk}
          approvalStatus={approvalStatus}
          setApprovalStatus={setApprovalStatus}
        />

        <div className="flex justify-center pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="primary"
            size="lg"
            className="w-[400px] h-[60px]"
            onClick={handleSaveInteraction}
            disabled={isAiProcessing}
          >
            Complete & Sync Record
          </Button>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-6 sticky top-32 h-[965px] flex flex-col overflow-hidden pr-2">
        <div className="flex-[4] min-h-0 flex flex-col">
          <AiCopilot
            engagementScore={engagementScore}
            buyingIntentScore={buyingIntentScore}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
          />
        </div>
        <div className="h-[280px] flex-none flex flex-col">
          <ActivityFeed />
        </div>
        <div className="flex-none">
          <EditTimeline interactionId={lastSavedId} />
        </div>
      </div>
    </div>
  );
}
