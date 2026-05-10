from fastapi import APIRouter, Depends
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, Field
from typing import List

from app.database.db import get_db
from app.database.models import Interaction

router = APIRouter(prefix="/stats", tags=["Analytics"])


class SalesInsight(BaseModel):
    title: str
    content: str
    type: str


class SalesInsightsList(BaseModel):
    insights: List[SalesInsight]


@router.get("/dashboard")
async def dashboard_analytics(db: Session = Depends(get_db)):
    total_interactions = db.query(Interaction).count()
    active_hcps = db.query(func.count(func.distinct(Interaction.hcp_name))).scalar()

    sentiment_counts = (
        db.query(Interaction.sentiment, func.count(Interaction.id))
        .group_by(Interaction.sentiment)
        .all()
    )
    sentiment_data = {s: count for s, count in sentiment_counts}

    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    fourteen_days_ago = now - timedelta(days=14)

    curr_interactions = (
        db.query(Interaction).filter(Interaction.created_at >= seven_days_ago).count()
    )
    prev_interactions = (
        db.query(Interaction)
        .filter(
            Interaction.created_at >= fourteen_days_ago,
            Interaction.created_at < seven_days_ago,
        )
        .count()
    )

    curr_hcps = (
        db.query(func.count(func.distinct(Interaction.hcp_name)))
        .filter(Interaction.created_at >= seven_days_ago)
        .scalar()
    )
    prev_hcps = (
        db.query(func.count(func.distinct(Interaction.hcp_name)))
        .filter(
            Interaction.created_at >= fourteen_days_ago,
            Interaction.created_at < seven_days_ago,
        )
        .scalar()
    )

    def calc_change(curr, prev):
        if prev == 0:
            return f"+100%" if curr > 0 else "0%"
        change = ((curr - prev) / prev) * 100
        return f"{'+' if change >= 0 else ''}{int(change)}%"

    interaction_change = calc_change(curr_interactions, prev_interactions)
    hcp_change = calc_change(curr_hcps, prev_hcps)

    trends = (
        db.query(
            func.date(Interaction.created_at).label("date"),
            func.count(Interaction.id).label("count"),
        )
        .filter(Interaction.created_at >= seven_days_ago)
        .group_by(func.date(Interaction.created_at))
        .order_by("date")
        .all()
    )

    top_hcps = (
        db.query(Interaction.hcp_name, func.count(Interaction.id).label("count"))
        .group_by(Interaction.hcp_name)
        .order_by(desc("count"))
        .limit(5)
        .all()
    )

    recent_logs = (
        db.query(Interaction).order_by(Interaction.created_at.desc()).limit(5).all()
    )

    follow_ups = (
        db.query(Interaction)
        .filter(Interaction.followups != None, Interaction.followups != "")
        .order_by(Interaction.created_at.desc())
        .limit(10)
        .all()
    )

    return {
        "total_interactions": total_interactions,
        "active_hcps": active_hcps,
        "changes": {
            "interactions": interaction_change,
            "hcps": hcp_change,
            "follow_ups": "Stable",
        },
        "sentiment": {
            "Positive": sentiment_data.get("Positive", 0),
            "Neutral": sentiment_data.get("Neutral", 0),
            "Negative": sentiment_data.get("Negative", 0),
        },
        "trends": [{"date": t.date, "count": t.count} for t in trends],
        "top_hcps": [{"name": h.hcp_name, "count": h.count} for h in top_hcps],
        "recent_logs": [
            {
                "id": item.id,
                "hcp_name": item.hcp_name,
                "sentiment": item.sentiment,
                "summary": item.summary,
                "created_at": item.created_at,
            }
            for item in recent_logs
        ],
        "follow_ups": [
            {
                "id": item.id,
                "hcp_name": item.hcp_name,
                "task": item.followups,
                "created_at": item.created_at,
            }
            for item in follow_ups
        ],
    }


@router.get("/ai-insights")
async def ai_sales_insights(db: Session = Depends(get_db)):
    from app.services.groq_service import llm

    recent_interactions = (
        db.query(Interaction).order_by(Interaction.created_at.desc()).limit(20).all()
    )

    if not recent_interactions:
        return {
            "insights": [
                {
                    "title": "Data Required",
                    "content": "Start logging interactions to unlock AI-driven sales strategy and sentiment analysis.",
                    "type": "engagement",
                }
            ]
        }

    context_data = [
        {
            "hcp": i.hcp_name,
            "sentiment": i.sentiment,
            "summary": i.summary,
            "insights": i.clinical_insights,
            "interest": i.interest_level,
        }
        for i in recent_interactions
    ]

    structured_llm = llm.with_structured_output(SalesInsightsList)

    prompt = f"""
    You are a Senior Pharma Sales Analyst. Analyze these recent HCP interactions:
    {context_data}

    Generate 3 high-level strategic sales insights. 
    Focus on trends in interest, common objections, or efficacy concerns.
    """

    try:
        result = await structured_llm.ainvoke(prompt)
        return result.model_dump()
    except Exception as e:
        print(f"AI Insight Error: {e}")
        return {
            "insights": [
                {
                    "title": "System Update",
                    "content": "AI strategy engine is currently refining its analysis. Check back shortly.",
                    "type": "general",
                }
            ]
        }
