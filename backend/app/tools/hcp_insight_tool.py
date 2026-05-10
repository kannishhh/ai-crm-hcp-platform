from app.services.groq_service import llm
from app.schemas.ai_schemas import HCPInsight
from app.schemas.enums import Sentiment
from langchain.tools import tool


@tool
async def hcp_insight_tool(interaction_context: str):
    """
    Generates engagement intelligence and behavioral insights from HCP interactions.
    """
    structured_llm = llm.with_structured_output(HCPInsight)

    prompt = f"""
    You are an Engagement Analytics Expert. Analyze the following HCP interaction context and calculate behavioral scores.
    
    Context:
    {interaction_context}
    """

    try:
        result = await structured_llm.ainvoke(prompt)
        return result.model_dump()
    except Exception as e:
        print(f"HCP Insight Tool Error: {e}")
        return {
            "sentiment": Sentiment.NEUTRAL,
            "interest_level": "Medium",
            "engagement_score": 50,
            "buying_intent_score": 30,
            "relationship_status": "Stable",
            "competitor_influence": "Medium",
            "objections": [],
        }
