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

class EnergySourceStatus(str, Enum):
    """Operational status of an energy source"""
    ONLINE = "online"
    OFFLINE = "offline"
    MAINTENANCE = "maintenance"
    STANDBY = "standby"

class WeatherState(BaseModel):
    """Current weather conditions affecting the grid"""
    wind_speed: float = Field(
        ...,
        ge=0.0,
        le=50.0,
        description="Wind speed in meters per second (m/s)"
    )
    cloud_cover: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Cloud cover percentage (0.0 = clear, 1.0 = overcast)"
    )
    temperature: float = Field(
        ...,
        ge=-30.0,
        le=50.0,
        description="Temperature in Celsius"
    )
    time_of_day: float = Field(
        ...,
        ge=0.0,
        le=24.0,
        description="Hour of day (0-24, deciption for minutes)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "wind_speed": 8.5,
                "cloud_cover": 0.3,
                "temperature": 12.0,
                "time_of_day": 14.5 
            }
        }

class DemandState(BaseModel):
    """Current power demand on the grid"""
    base_load: float = field(
        ...,
        ge=0.0,
        description="Base residential/commerical demand in MW"
    )
    industrial_load: float = Field(
        default=0.0,
        ge=0.0,
        description="Industrial demand in MW (can be toggled on/off)"
    )
    heating_cooling_lod: float = field(
        default=0.0,
        ge=0.0,
        description="Temperature-dependent heating/cooling load in MW"
    )

    @property
    def total_demand(self) -> float:
        """Calculate total power demand"""
        return self.base_load + self.industrial_load + self.heating_cooling_load

    class Config:
        json_schema_extra = {
            "example": {
                "base_load": 350.0,
                "industrial_load": 50.0,
                "heating_cooling_load": 30.0
            }
        }

class EnergySource(BaseModel):
    """Base model for an energy source"""
    source_type: EnergySourceType
    status: EnergySourceStatus = EnergySourceStatus.ONLINE
    capacity_mw: float = Field(
        ...,
        gt=0.0,
        description:"Maximum capacity in megawatts"
    )
    current_output_mw: float = Field(
        default=0.0,
        ge=0.0,
        description="Current power output in megawatts"
    )
    @property
    def capacity_factor(self) -> float:
        """Percentage of capacity currently being used"""
        if self.capacity_mw == 0:
            return 0.0
        return (self.current_output_mw / self.capacity_mw) * 100

    class Config:
        json_schema_extra = {
            "example": {
                "source_type": "wind",
                "status": "online",
                "capacity_mw": 450.0,
                "current_output_mw": 320.0
            }
        }
    
class WindTurbineState(EnergySource):
    """State of wind turbine array"""
    source_type: EnergySourceType = EnergySourceType.WIND
    num_turbines: int = Field(default=50, gt=0)
    turbine_capacity_mw: float = Field(default=9.0, gt=0.0)

    def __init__(self, **data):
        #auto-calc total capacity if not provided
        if 'capacity_mw' not in data:
            data['capacity_mw'] = data.get('num_turbines', 50) * data.get('turbine_capacity_mw', 9.0)
        super().__init__(**data)

