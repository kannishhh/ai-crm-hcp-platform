from sqlalchemy.orm import Session
from app.database.models import Notification
from app.sockets.manager import SocketManager
from app.database.db import SessionLocal


async def create_notification(type: str, message: str, metadata: dict = None):
    """
    Creates a notification in DB and emits it via Socket.IO
    """
    db = SessionLocal()
    try:
        new_notification = Notification(
            type=type,
            message=message,
            metadata_json=str(metadata) if metadata else None,
        )
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)

        socket_data = {
            "id": new_notification.id,
            "type": new_notification.type,
            "message": new_notification.message,
            "timestamp": new_notification.timestamp.isoformat(),
            "is_read": new_notification.is_read,
        }

        await SocketManager.emit_notification(socket_data)
        return new_notification
    finally:
        db.close()
