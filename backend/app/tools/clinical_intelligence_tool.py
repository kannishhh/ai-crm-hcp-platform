from app.services.groq_service import llm
from app.schemas.ai_schemas import ClinicalExtraction
from langchain.tools import tool
import json


@tool
async def extract_clinical_intelligence(text: str):
    """
    Analyzes HCP interaction notes and extracts structured clinical intelligence.
    Use this to extract hcp_name, sentiment, insights, followups, and compliance risks.
    """
    structured_llm = llm.with_structured_output(ClinicalExtraction)

    prompt = f"""
    You are a Senior Clinical Strategy Expert. Analyze the following pharma interaction and extract all required data points.
    Ensure the 'cleaned_narrative' contains ONLY the pure clinical summary without any meta-talk or AI preamble.
    
    Interaction Notes:
    {text}
    """

    try:
        result = await structured_llm.ainvoke(prompt)

        return result.model_dump()
    except Exception as e:
        print(f"Extraction Tool Error: {e}")
        return {
            "summary": "AI processing error.",
            "sentiment": "Neutral",
            "followups": [],
            "hcp_name": "Unknown HCP",
            "clinical_insights": "Analysis failed.",
            "engagement_score": 50,
            "buying_intent_score": 30,
        }
