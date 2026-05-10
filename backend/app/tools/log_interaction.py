from langchain.tools import tool
from app.tools.save_interaction_tool import save_interaction
from app.database.db import SessionLocal
from typing import Dict, Any


@tool
async def log_interaction_tool(interaction_data: Dict[str, Any]):
    """
    Saves a new HCP interaction to the database.
    """
    db = SessionLocal()
    try:
        interaction_id = await save_interaction(interaction_data, db)
        return {
            "status": "success",
            "message": "Interaction logged successfully.",
            "interaction_id": interaction_id,
            "data": interaction_data,
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to log interaction: {str(e)}"}
    finally:
        db.close()
