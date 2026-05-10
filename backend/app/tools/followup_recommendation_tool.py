from app.services.groq_service import llm
from app.schemas.ai_schemas import FollowupRecommendation
from app.schemas.enums import Priority
from langchain.tools import tool

@tool
async def followup_recommendation_tool(interaction_data: str):
    """
    Analyzes HCP interaction data to generate intelligent next actions and follow-up recommendations.
    """
    structured_llm = llm.with_structured_output(FollowupRecommendation)
    
    prompt = f"""
    You are an AI Clinical Strategy Expert. Analyze the following interaction and generate high-value follow-up recommendations.
    
    Interaction Data:
    {interaction_data}
    """
    
    try:
        result = await structured_llm.ainvoke(prompt)
        return result.model_dump()
    except Exception as e:
        print(f"Followup Tool Error: {e}")
        return {
            "followups": ["General follow-up required"],
            "priority": Priority.MEDIUM,
            "timeline": "TBD",
            "recommended_materials": [],
            "next_meeting_suggestion": "Routine check-in"
        }
