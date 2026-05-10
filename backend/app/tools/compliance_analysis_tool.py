from langchain.tools import tool
from app.services.groq_service import llm
from app.schemas.ai_schemas import ComplianceAudit
from app.schemas.enums import RiskLevel


@tool
async def compliance_analysis_tool(interaction_context: str):
    """
    Audits pharma interaction context for compliance risks, therapeutic claim violations, and off-label promotion.
    """
    structured_llm = llm.with_structured_output(ComplianceAudit)

    prompt = f"""
    You are a Pharma Compliance Auditor. Audit the following interaction for regulatory risks.
    Focus on therapeutic claim integrity, off-label promotion, and adverse event reporting compliance.
    
    Interaction Context:
    {interaction_context}
    """

    try:
        result = await structured_llm.ainvoke(prompt)
        return result.model_dump()
    except Exception as e:
        print(f"Compliance Tool Error: {e}")
        return {
            "risk_level": RiskLevel.LOW,
            "flagged_content": [],
            "compliance_notes": "Audit could not be completed.",
            "recommended_action": "Manual review required.",
            "requires_medical_review": False,
            "adverse_event_detected": False,
        }
