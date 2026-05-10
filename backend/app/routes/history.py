from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import Interaction
from app.schemas.interaction_schema import InteractionUpdateRequest

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/all")
async def get_all_interactions(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).order_by(Interaction.id.desc()).all()
    result = []

    for item in interactions:
        result.append(
            {
                "id": item.id,
                "hcp_name": item.hcp_name,
                "sentiment": item.sentiment,
                "topics": item.topics,
                "followups": item.followups,
                "summary": item.summary,
                "created_at": item.created_at,
            }
        )

    return result


@router.put("/update/{interaction_id}")
async def update_interaction(
    interaction_id: int, data: InteractionUpdateRequest, db: Session = Depends(get_db)
):
    from app.services.interaction_update_service import InteractionUpdateService

    updated = await InteractionUpdateService.update_interaction(
        db=db,
        interaction_id=interaction_id,
        updates=data.model_dump(exclude_unset=True),
        changed_by="User",
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Interaction not found")

    return {"success": True, "message": "Interaction updated"}


@router.get("/{interaction_id}/edits")
async def get_interaction_edits(interaction_id: int, db: Session = Depends(get_db)):
    from app.database.models import EditHistory

    edits = (
        db.query(EditHistory)
        .filter(EditHistory.interaction_id == interaction_id)
        .order_by(EditHistory.timestamp.desc())
        .all()
    )
    return edits
