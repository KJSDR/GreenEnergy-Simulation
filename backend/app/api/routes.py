"""
API Routes

REST endpoints for controlling and querying the simulation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.shared import get_engine, reset_engine
from app.models.grid_state import GridState


# Create router
router = APIRouter(prefix="/api", tags=["simulation"])


# Request/Response models
class ControlWindRequest(BaseModel):
    wind_speed: float

class ControlCloudsRequest(BaseModel):
    cloud_cover: float

class ControlTemperatureRequest(BaseModel):
    temperature: float

class ControlIndustrialRequest(BaseModel):
    enabled: bool


# Routes
@router.get("/state", response_model=GridState)
async def get_current_state():
    """Get current grid state without advancing the simulation"""
    return get_engine().get_current_state()


@router.post("/tick", response_model=GridState)
async def advance_tick():
    """Manually advance simulation by one tick"""
    return get_engine().tick()


@router.post("/reset")
async def reset_simulation():
    """Reset simulation to initial state"""
    reset_engine()
    return {"status": "reset", "message": "Simulation reset to initial state"}


@router.post("/control/wind")
async def control_wind(request: ControlWindRequest):
    """Manually set wind speed"""
    sim = get_engine()
    sim.weather.set_wind(request.wind_speed)
    return {
        "status": "ok",
        "wind_speed": sim.weather.wind_speed
    }


@router.post("/control/clouds")
async def control_clouds(request: ControlCloudsRequest):
    """Manually set cloud cover"""
    sim = get_engine()
    sim.weather.set_clouds(request.cloud_cover)
    return {
        "status": "ok",
        "cloud_cover": sim.weather.cloud_cover
    }


@router.post("/control/temperature")
async def control_temperature(request: ControlTemperatureRequest):
    """Manually set temperature"""
    sim = get_engine()
    sim.weather.set_temperature(request.temperature)
    return {
        "status": "ok",
        "temperature": sim.weather.temperature
    }


@router.post("/control/industrial")
async def control_industrial(request: ControlIndustrialRequest):
    """Toggle industrial load"""
    sim = get_engine()
    sim.demand.industrial_enabled = request.enabled
    return {
        "status": "ok",
        "industrial_enabled": sim.demand.industrial_enabled
    }


@router.post("/scenario/storm")
async def trigger_storm():
    """Trigger storm weather scenario"""
    sim = get_engine()
    sim.weather.trigger_storm()
    return {
        "status": "ok",
        "scenario": "storm",
        "wind_speed": sim.weather.wind_speed,
        "cloud_cover": sim.weather.cloud_cover
    }


@router.post("/scenario/calm")
async def trigger_calm():
    """Trigger calm weather scenario"""
    sim = get_engine()
    sim.weather.trigger_calm()
    return {
        "status": "ok",
        "scenario": "calm",
        "wind_speed": sim.weather.wind_speed,
        "cloud_cover": sim.weather.cloud_cover
    }


@router.get("/info")
async def get_simulation_info():
    """Get simulation configuration info"""
    sim = get_engine()
    return {
        "wind_capacity_mw": sim.wind.total_capacity_mw,
        "solar_capacity_mw": sim.solar.capacity_mw,
        "battery_capacity_mwh": sim.battery.max_capacity_mwh,
        "gas_capacity_mw": sim.gas.capacity_mw,
        "tick_duration_minutes": sim.time.tick_duration_minutes,
        "current_day": sim.time.current_day,
        "current_hour": sim.time.current_hour
    }


# Simulation control endpoints
class SimulationControlRequest(BaseModel):
    paused: bool

class SpeedControlRequest(BaseModel):
    speed: float


@router.post("/control/pause")
async def control_pause(request: SimulationControlRequest):
    """Pause/unpause simulation"""
    from app.api import websocket
    websocket.is_paused = request.paused
    return {
        "status": "ok",
        "paused": request.paused
    }


@router.post("/control/speed")
async def control_speed(request: SpeedControlRequest):
    """Set simulation speed multiplier"""
    from app.api import websocket
    # Speed: 0.5x, 1x, 2x, 4x, 8x
    websocket.speed_multiplier = request.speed
    return {
        "status": "ok",
        "speed": request.speed
    }