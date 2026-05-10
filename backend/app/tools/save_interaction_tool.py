from app.database.models import Interaction
from sqlalchemy.orm import Session


from app.services.notification_service import create_notification


async def save_interaction(data: dict, db: Session):
    interaction = Interaction()

    for key, value in data.items():
        if hasattr(interaction, key):
            setattr(interaction, key, value)

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    await create_notification(
        type="interaction",
        message=f"New engagement logged with {interaction.hcp_name}",
        metadata={"interaction_id": interaction.id},
    )

    return interaction.id
