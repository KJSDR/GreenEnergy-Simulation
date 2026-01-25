"""
API Routes

REST endpoints for controlling and querying the simulation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.simulation.simulation_engine import SimulationEngine
from app.models.grid_state import GridState


# Create router
router = APIRouter(prefix="/api", tags=["simulation"])

# Global simulation instance (in production, this would be managed better)
sim_engine: Optional[SimulationEngine] = None


def get_simulation() -> SimulationEngine:
    """Get or create simulation instance"""
    global sim_engine
    if sim_engine is None:
        sim_engine = SimulationEngine()
    return sim_engine


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
    """Get current grid state"""
    sim = get_simulation()
    # Run one tick to get latest state
    state = sim.tick()
    return state


@router.post("/tick", response_model=GridState)
async def advance_tick():
    """Manually advance simulation by one tick"""
    sim = get_simulation()
    state = sim.tick()
    return state


@router.post("/reset")
async def reset_simulation():
    """Reset simulation to initial state"""
    global sim_engine
    sim_engine = SimulationEngine()
    return {"status": "reset", "message": "Simulation reset to initial state"}


@router.post("/control/wind")
async def control_wind(request: ControlWindRequest):
    """Manually set wind speed"""
    sim = get_simulation()
    sim.weather.set_wind(request.wind_speed)
    return {
        "status": "ok",
        "wind_speed": sim.weather.wind_speed
    }


@router.post("/control/clouds")
async def control_clouds(request: ControlCloudsRequest):
    """Manually set cloud cover"""
    sim = get_simulation()
    sim.weather.set_clouds(request.cloud_cover)
    return {
        "status": "ok",
        "cloud_cover": sim.weather.cloud_cover
    }


@router.post("/control/temperature")
async def control_temperature(request: ControlTemperatureRequest):
    """Manually set temperature"""
    sim = get_simulation()
    sim.weather.set_temperature(request.temperature)
    return {
        "status": "ok",
        "temperature": sim.weather.temperature
    }


@router.post("/control/industrial")
async def control_industrial(request: ControlIndustrialRequest):
    """Toggle industrial load"""
    sim = get_simulation()
    sim.demand.industrial_enabled = request.enabled
    return {
        "status": "ok",
        "industrial_enabled": sim.demand.industrial_enabled
    }


@router.post("/scenario/storm")
async def trigger_storm():
    """Trigger storm weather scenario"""
    sim = get_simulation()
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
    sim = get_simulation()
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
    sim = get_simulation()
    return {
        "wind_capacity_mw": sim.wind.total_capacity_mw,
        "solar_capacity_mw": sim.solar.capacity_mw,
        "battery_capacity_mwh": sim.battery.max_capacity_mwh,
        "gas_capacity_mw": sim.gas.capacity_mw,
        "tick_duration_minutes": sim.time.tick_duration_minutes,
        "current_day": sim.time.current_day,
        "current_hour": sim.time.current_hour
    }