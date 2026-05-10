from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.enums import (
    Sentiment,
    RiskLevel,
    InteractionType,
    Priority,
    ApprovalStatus,
)


class ClinicalExtraction(BaseModel):
    clinical_insights: str = Field(
        description="Key clinical takeaways from the interaction"
    )
    objections: str = Field(description="Any concerns or objections raised by the HCP")
    competitor_mentions: str = Field(
        description="Any competitor products or companies mentioned"
    )
    patient_concerns: str = Field(description="Concerns regarding patients discussed")
    prescription_intent: str = Field(
        description="Very Likely, Likely, Neutral, Unlikely"
    )
    interest_level: str = Field(description="High, Medium, Low, None")
    engagement_score: int = Field(description="0-100 score reflecting HCP receptivity")
    buying_intent_score: int = Field(
        description="0-100 score reflecting likelihood of prescribing"
    )
    summary: str = Field(description="A concise professional summary of the meeting")
    sentiment: Sentiment = Field(description="Positive, Neutral, or Negative")
    followups: List[str] = Field(
        description="List of specific actionable follow-up tasks"
    )
    hcp_name: Optional[str] = Field(description="Detected name of the HCP")
    compliance_risk: RiskLevel = Field(
        description="Regulatory risk level: Low, Medium, High"
    )
    flagged_content: List[str] = Field(
        description="Specific text segments that trigger compliance concerns"
    )
    interaction_type: InteractionType = Field(
        description="Meeting, Call, Email, Webinar, etc."
    )
    meeting_mode: str = Field(description="In-Person or Virtual")
    location: str = Field(description="Clinic, Hospital, Office, etc.")
    duration: int = Field(description="Estimated duration in minutes")
    attendees: List[str] = Field(description="Other participants mentioned")
    outcome: str = Field(description="Main outcome of the interaction")
    outcome_priority: Priority = Field(description="Strategic priority of the outcome")
    risk_level: RiskLevel = Field(description="Churn/Relationship risk level")
    adverse_event: bool = Field(description="True if an adverse event was reported")
    cleaned_narrative: str = Field(
        description="Pure clinical text without user instructions"
    )
    materials_shared: List[str] = Field(
        description="List of specific clinical materials or documents mentioned"
    )
    followup_tasks: List[Dict[str, Any]] = Field(
        description="List of objects with 'task', 'priority', and 'due_date'"
    )
    outcome_notes: str = Field(
        description="Detailed narrative explaining the meeting outcome and commitments"
    )
    approval_status: ApprovalStatus = Field(
        description="Suggested compliance status: Pending, Approved, or Requires Review"
    )


class ComplianceAudit(BaseModel):
    risk_level: RiskLevel
    flagged_content: List[str]
    compliance_notes: str
    recommended_action: str


class FollowupRecommendation(BaseModel):
    followups: List[str]
    priority: Priority
    timeline: str
    recommended_materials: List[str]
    next_meeting_suggestion: str


class HCPInsight(BaseModel):
    sentiment: Sentiment
    interest_level: str
    engagement_score: int
    buying_intent_score: int
    relationship_status: str
    competitor_influence: str
    objections: List[str]
