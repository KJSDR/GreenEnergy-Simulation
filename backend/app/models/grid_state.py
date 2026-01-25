"""
Grid State Models
Pydantic models define structure of the grid sim data
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class EnergySourceType(str, Enum):
    """Types of energy sources in the grid"""
    WIND = "wind"
    SOLAR = "solar"
    BATTERY = "battery"
    GAS = "gas"

