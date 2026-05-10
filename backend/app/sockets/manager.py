import socketio
import json
from datetime import datetime, timezone

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")

sio_app = socketio.ASGIApp(sio)


@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit("notification_stats", {"status": "ready"}, to=sid)


@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


class SocketManager:
    @staticmethod
    async def emit_notification(notification_data: dict):
        """
        Emits a notification to all connected clients.
        Expected data format: {id, type, message, timestamp, is_read}
        """
        await sio.emit("new_notification", notification_data)
        await sio.emit("refresh_dashboard", {"type": "stats"})

    @staticmethod
    async def emit_ai_status(status: str, hcp_name: str = None):
        """
        Emits AI processing status.
        """
        await sio.emit(
            "ai_status",
            {
                "status": status,
                "hcp_name": hcp_name,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    @staticmethod
    async def emit_refresh_feed():
        """
        Tells clients to refresh their activity feeds.
        """
        await sio.emit(
            "refresh_feed", {"timestamp": datetime.now(timezone.utc).isoformat()}
        )

    @staticmethod
    async def broadcast(event: str, data: dict):
        """
        Generic broadcast method to emit any event to all clients.
        """
        await sio.emit(event, data)

        if "interaction" in event:
            await sio.emit("new_interaction_saved", data)
            await sio.emit("analytics_updated", {"type": "all"})

        if "compliance" in event:
            await sio.emit("compliance_risk_detected", data)

        if "followup" in event:
            await sio.emit("followup_generated", data)

        if "interaction" in event or "edit" in event:
            await sio.emit("refresh_dashboard", {"type": "all"})

    @staticmethod
    async def emit_ai_edit_completed(data: dict):
        """
        Emits a specialized event when an AI-driven edit is finished.
        """
        await sio.emit("ai_edit_completed", data)
