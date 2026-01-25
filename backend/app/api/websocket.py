"""
WebSocket Endpoint

Streams real-time simulation state updates to connected clients.
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import asyncio
import json

from app.simulation.simulation_engine import SimulationEngine


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
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                # Connection closed, remove it
                self.active_connections.remove(connection)


# Global connection manager and simulation
manager = ConnectionManager()
sim_engine: SimulationEngine = None


async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time simulation updates
    
    Clients connect and receive state updates every tick (configurable interval)
    """
    global sim_engine
    
    # Initialize simulation if needed
    if sim_engine is None:
        sim_engine = SimulationEngine()
    
    await manager.connect(websocket)
    
    try:
        # Send initial state immediately
        state = sim_engine.tick()
        await websocket.send_json({
            "type": "state_update",
            "data": json.loads(state.model_dump_json())
        })
        
        # Simulation loop - send updates every 2 seconds
        while True:
            await asyncio.sleep(2.0)  # 2 second interval for demo
            
            # Advance simulation and get new state
            state = sim_engine.tick()
            
            # Broadcast to all connected clients
            message = {
                "type": "state_update",
                "data": json.loads(state.model_dump_json())
            }
            await manager.broadcast(message)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
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
    global sim_engine
    
    if sim_engine is None:
        return
    
    action = command.get("action")
    value = command.get("value")
    
    if action == "set_wind":
        sim_engine.weather.set_wind(value)
    elif action == "set_clouds":
        sim_engine.weather.set_clouds(value)
    elif action == "set_temperature":
        sim_engine.weather.set_temperature(value)
    elif action == "toggle_industrial":
        sim_engine.demand.industrial_enabled = value
    elif action == "trigger_storm":
        sim_engine.weather.trigger_storm()
    elif action == "trigger_calm":
        sim_engine.weather.trigger_calm()
    elif action == "reset":
        sim_engine.reset()
    
    # Send acknowledgment
    await websocket.send_json({
        "type": "command_ack",
        "action": action,
        "status": "ok"
    })