from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float
from datetime import datetime, timezone
from app.database.db import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String)
    sentiment = Column(String)
    topics = Column(Text)
    followups = Column(Text)
    summary = Column(Text)

    interaction_type = Column(String, default="Meeting")
    duration = Column(Integer, default=30)
    location = Column(String)
    attendees = Column(Text)
    internal_participants = Column(Text)
    meeting_mode = Column(String)

    clinical_insights = Column(Text)
    objections = Column(Text)
    competitor_mentions = Column(Text)
    patient_concerns = Column(Text)
    prescription_intent = Column(String)
    interest_level = Column(String)
    engagement_score = Column(Integer)
    buying_intent_score = Column(Integer)

    outcome = Column(String)
    outcome_notes = Column(Text)
    outcome_priority = Column(String)
    risk_level = Column(String)

    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    followup_tasks = Column(Text)

    compliance_reviewed = Column(Boolean, default=False)
    approval_status = Column(String, default="Pending")
    flagged_content = Column(Text)
    adverse_event = Column(Boolean, default=False)
    medical_review_status = Column(String, default="Not Required")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    updated_by_ai = Column(Boolean, default=False)


class EditHistory(Base):
    __tablename__ = "edit_history"

    id = Column(Integer, primary_key=True, index=True)
    interaction_id = Column(Integer, index=True)
    field = Column(String)
    old_value = Column(Text)
    new_value = Column(Text)
    changed_by = Column(String, default="AI Genie")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    metadata_json = Column(Text)
