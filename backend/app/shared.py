"""
Shared simulation engine instance

Single source of truth — both the REST API and the WebSocket endpoint
import from here so they always operate on the same engine.
"""

from typing import Optional
from app.simulation.simulation_engine import SimulationEngine

_engine: Optional[SimulationEngine] = None


def get_engine() -> SimulationEngine:
    global _engine
    if _engine is None:
        _engine = SimulationEngine()
    return _engine


def reset_engine() -> SimulationEngine:
    global _engine
    _engine = SimulationEngine()
    return _engine
