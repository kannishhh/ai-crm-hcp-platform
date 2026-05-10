from sqlalchemy.orm import Session
from app.database.models import Interaction, EditHistory
from app.sockets.manager import SocketManager as socket_manager
from datetime import datetime, timezone
import json


class InteractionUpdateService:
    @staticmethod
    async def update_interaction(
        db: Session, interaction_id: int, updates: dict, changed_by: str = "AI Genie"
    ):
        interaction = (
            db.query(Interaction).filter(Interaction.id == interaction_id).first()
        )
        if not interaction:
            return None

        history_entries = []
        for field, new_value in updates.items():
            if hasattr(interaction, field):
                old_value = getattr(interaction, field)

                if isinstance(new_value, (list, dict)):
                    new_value_str = json.dumps(new_value)
                else:
                    new_value_str = str(new_value) if new_value is not None else ""

                if isinstance(old_value, (list, dict)):
                    old_value_str = json.dumps(old_value)
                else:
                    old_value_str = str(old_value) if old_value is not None else ""

                if old_value_str != new_value_str:
                    setattr(interaction, field, new_value)

                    history = EditHistory(
                        interaction_id=interaction_id,
                        field=field,
                        old_value=old_value_str,
                        new_value=new_value_str,
                        changed_by=changed_by,
                    )
                    history_entries.append(history)

        if history_entries:
            interaction.updated_at = datetime.now(timezone.utc)
            interaction.updated_by_ai = changed_by == "AI Genie"
            db.add_all(history_entries)
            db.commit()
            db.refresh(interaction)

            await socket_manager.broadcast(
                "interaction_updated",
                {
                    "interaction_id": interaction_id,
                    "updates": updates,
                    "history": [
                        {
                            "field": h.field,
                            "old_value": h.old_value,
                            "new_value": h.new_value,
                            "timestamp": h.timestamp.isoformat(),
                        }
                        for h in history_entries
                    ],
                },
            )

            if "compliance_reviewed" in updates or "approval_status" in updates:
                await socket_manager.broadcast(
                    "compliance_updated", {"interaction_id": interaction_id}
                )

            if "followup_tasks" in updates:
                await socket_manager.broadcast(
                    "followup_updated", {"interaction_id": interaction_id}
                )

            return interaction

        return interaction

    @staticmethod
    async def undo_last_edit(db: Session, interaction_id: int):
        last_edit = (
            db.query(EditHistory)
            .filter(EditHistory.interaction_id == interaction_id)
            .order_by(EditHistory.timestamp.desc())
            .first()
        )
        if not last_edit:
            return None

        interaction = (
            db.query(Interaction).filter(Interaction.id == interaction_id).first()
        )
        if interaction and hasattr(interaction, last_edit.field):
            val = last_edit.old_value
            if val.startswith("[") or val.startswith("{"):
                try:
                    val = json.loads(val)
                except:
                    pass

            setattr(interaction, last_edit.field, val)
            db.delete(last_edit)
            db.commit()
            db.refresh(interaction)

            await socket_manager.broadcast(
                "interaction_updated",
                {
                    "interaction_id": interaction_id,
                    "undo": True,
                    "field": last_edit.field,
                },
            )

            return interaction
        return None
