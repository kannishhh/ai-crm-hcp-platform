from pydantic import BaseModel, Field
from typing import Optional, List, Any
from app.schemas.enums import (
    Sentiment,
    RiskLevel,
    InteractionType,
    Priority,
    ApprovalStatus,
)


class InteractionRequest(BaseModel):
    topics: Optional[str] = None
    hcp_name: Optional[str] = None
    user_question: Optional[str] = None
    history: Optional[List[dict]] = None
    context: Optional[dict] = None


class InteractionSaveRequest(BaseModel):
    hcp_name: str
    sentiment: Sentiment = Sentiment.NEUTRAL
    topics: Optional[str] = None
    followups: Optional[str] = None
    summary: Optional[str] = None
    interaction_type: InteractionType = InteractionType.MEETING
    duration: int = 30
    location: Optional[str] = None
    attendees: Optional[str] = None
    internal_participants: Optional[str] = None
    meeting_mode: Optional[str] = None
    clinical_insights: Optional[str] = None
    objections: Optional[str] = None
    competitor_mentions: Optional[str] = None
    patient_concerns: Optional[str] = None
    prescription_intent: Optional[str] = None
    interest_level: Optional[str] = None
    engagement_score: int = 50
    buying_intent_score: int = 30
    outcome: Optional[str] = None
    outcome_notes: Optional[str] = None
    outcome_priority: Priority = Priority.MEDIUM
    risk_level: RiskLevel = RiskLevel.LOW
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    followup_tasks: Optional[str] = None
    compliance_reviewed: bool = False
    approval_status: ApprovalStatus = ApprovalStatus.PENDING
    flagged_content: Optional[str] = None
    adverse_event: bool = False
    medical_review_status: str = "Not Required"
    updated_by_ai: bool = False


class InteractionUpdateRequest(BaseModel):
    hcp_name: Optional[str] = None
    sentiment: Optional[Sentiment] = None
    topics: Optional[str] = None
    followups: Optional[str] = None
    summary: Optional[str] = None
    interaction_type: Optional[InteractionType] = None
    duration: Optional[int] = None
    location: Optional[str] = None
    attendees: Optional[str] = None
    internal_participants: Optional[str] = None
    meeting_mode: Optional[str] = None
    clinical_insights: Optional[str] = None
    objections: Optional[str] = None
    competitor_mentions: Optional[str] = None
    patient_concerns: Optional[str] = None
    prescription_intent: Optional[str] = None
    interest_level: Optional[str] = None
    engagement_score: Optional[int] = None
    buying_intent_score: Optional[int] = None
    outcome: Optional[str] = None
    outcome_notes: Optional[str] = None
    outcome_priority: Optional[Priority] = None
    risk_level: Optional[RiskLevel] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    followup_tasks: Optional[str] = None
    compliance_reviewed: Optional[bool] = None
    approval_status: Optional[ApprovalStatus] = None
    flagged_content: Optional[str] = None
    adverse_event: Optional[bool] = None
    medical_review_status: Optional[str] = None
    updated_by_ai: Optional[bool] = None
