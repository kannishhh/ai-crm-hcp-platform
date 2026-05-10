from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.interaction_schema import InteractionRequest, InteractionSaveRequest
from app.tools.save_interaction_tool import save_interaction

router = APIRouter(prefix="/interaction", tags=["Interaction"])


@router.post("/analyze")
async def analyze_interaction(data: InteractionRequest):
    from app.services.ai.chat_service import ChatService
    from app.services.notification_service import create_notification
    from app.sockets.manager import SocketManager

    await SocketManager.emit_ai_status("processing")

    if data.user_question:
        context = data.context if data.context else {"topics": data.topics}
        result = await ChatService.process_chat_request(
            question=data.user_question, context=context, history=data.history
        )
        notification_msg = "Genie AI: Chat response generated"
    else:
        result = await ChatService.process_extraction_request(data.topics)
        hcp_name = result.get("hcp_name", "HCP")
        notification_msg = f"Genie AI: Clinical analysis complete for {hcp_name}"

        risk = result.get("compliance_risk", "Low")
        if risk in ["Medium", "High"]:
            await create_notification(
                type="compliance",
                message=f"Compliance Alert: {risk} risk detected in interaction with {hcp_name}",
                metadata={"risk": risk, "flagged": result.get("flagged_content")},
            )

    data_content = result.get("data", result) if data.user_question else result
    hcp_name = data_content.get("hcp_name", "Unknown HCP")

    if (
        data.user_question
        and "save" in data.user_question.lower()
        and result.get("data")
    ):
        from app.tools.save_interaction_tool import save_interaction
        from app.database.db import SessionLocal

        try:
            with SessionLocal() as db:

                interaction_id = await save_interaction(result["data"], db)
                result["interaction_id"] = interaction_id
                notification_msg += " and auto-saved to CRM"
        except Exception as e:
            print(f"Auto-save Error: {e}")

    await create_notification(
        type="ai",
        message=notification_msg,
        metadata={"hcp_name": hcp_name},
    )

    await SocketManager.emit_ai_status("idle")

    return {
        "success": True,
        "data": result,
    }


@router.post("/save")
async def save_interaction_route(
    data: InteractionSaveRequest, db: Session = Depends(get_db)
):
    interaction_id = await save_interaction(data.model_dump(), db)
    return {"success": True, "interaction_id": interaction_id}
