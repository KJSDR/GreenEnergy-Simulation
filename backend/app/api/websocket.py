"""
WebSocket Endpoint

Streams real-time simulation state updates to connected clients.
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import asyncio
import json

from app.shared import get_engine, reset_engine


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        self.active_connections.remove(websocket)
        
    async def broadcast(self, message: dict):
        """Send message to all connected clients"""
        for connection in self.active_connections[:]:  # iterate over copy to allow safe removal
            try:
                await connection.send_json(message)
            except:
                self.active_connections.remove(connection)


# Global connection manager
manager = ConnectionManager()
is_paused: bool = False
speed_multiplier: float = 1.0


async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time simulation updates.
    Uses the shared engine from app.shared so REST control commands
    affect the same simulation instance.
    """
    print("🔌 WebSocket connection attempt...")
    await manager.connect(websocket)
    print("✅ WebSocket accepted!")

    try:
        # Send current state immediately without advancing the clock
        state = get_engine().get_current_state()
        await websocket.send_json({
            "type": "state_update",
            "data": json.loads(state.model_dump_json())
        })
        print("✅ Initial state sent!")

        # Simulation loop - send updates based on speed
        while True:
            delay = 2.0 / speed_multiplier if speed_multiplier > 0 else 2.0
            await asyncio.sleep(delay)

            if is_paused:
                continue

            state = get_engine().tick()
            message = {
                "type": "state_update",
                "data": json.loads(state.model_dump_json())
            }
            await manager.broadcast(message)

    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"💥 WebSocket error: {e}")
        import traceback
        traceback.print_exc()
        manager.disconnect(websocket)


# Control commands handler
async def handle_control_command(websocket: WebSocket, command: dict):
    """
    Handle control commands from client

    Commands:
    - {"action": "set_wind", "value": 12.5}
    - {"action": "set_clouds", "value": 0.7}
    - {"action": "reset"}
    - etc.
    """
    action = command.get("action")
    value = command.get("value")
    engine = get_engine()

    if action == "set_wind":
        engine.weather.set_wind(value)
    elif action == "set_clouds":
        engine.weather.set_clouds(value)
    elif action == "set_temperature":
        engine.weather.set_temperature(value)
    elif action == "toggle_industrial":
        engine.demand.industrial_enabled = value
    elif action == "trigger_storm":
        engine.weather.trigger_storm()
    elif action == "trigger_calm":
        engine.weather.trigger_calm()
    elif action == "reset":
        reset_engine()
    
    # Send acknowledgment
    await websocket.send_json({
        "type": "command_ack",
        "action": action,
        "status": "ok"
    })