from langchain.tools import tool
from app.services.interaction_update_service import InteractionUpdateService
from app.database.db import SessionLocal
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict


class EditInteractionInput(BaseModel):
    interaction_id: int = Field(..., description="The ID of the interaction to edit")
    updates: Dict[str, Any] = Field(
        ..., description="A dictionary of field names and their new values"
    )


@tool("edit_interaction_tool", args_schema=EditInteractionInput)
async def edit_interaction_tool(interaction_id: int, updates: Dict[str, Any]):
    """
    Updates specific fields of an interaction in the CRM database.
    Use this tool when the user wants to change, update, or correct existing interaction data.
    """
    db = SessionLocal()
    try:
        updated_interaction = await InteractionUpdateService.update_interaction(
            db=db, interaction_id=interaction_id, updates=updates, changed_by="AI Genie"
        )

        if updated_interaction:
            return {
                "status": "success",
                "message": f"Updated fields {', '.join(updates.keys())} successfully.",
                "interaction_id": interaction_id,
                "updates": updates,
            }
        else:
            return {
                "status": "error",
                "message": f"Interaction with ID {interaction_id} not found.",
            }
    except Exception as e:
        return {"status": "error", "message": f"Failed to update interaction: {str(e)}"}
    finally:
        db.close()
