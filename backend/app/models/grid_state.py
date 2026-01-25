"""
Grid State Models

These Pydantic models define the structure of the grid simulation data.
They serve as the "single source of truth" for what data exists in the system.
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
        description="Hour of day (0-24, decimal for minutes)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "wind_speed": 8.5,
                "cloud_cover": 0.3,
                "temperature": 12.0,
                "time_of_day": 14.5  # 2:30 PM
            }
        }


class DemandState(BaseModel):
    """Current power demand on the grid"""
    base_load: float = Field(
        ...,
        ge=0.0,
        description="Base residential/commercial demand in MW"
    )
    industrial_load: float = Field(
        default=0.0,
        ge=0.0,
        description="Industrial demand in MW (can be toggled on/off)"
    )
    heating_cooling_load: float = Field(
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
        description="Maximum capacity in megawatts"
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
        # Auto-calculate total capacity if not provided
        if 'capacity_mw' not in data:
            data['capacity_mw'] = data.get('num_turbines', 50) * data.get('turbine_capacity_mw', 9.0)
        super().__init__(**data)


class SolarArrayState(EnergySource):
    """State of solar panel array"""
    source_type: EnergySourceType = EnergySourceType.SOLAR
    array_area_m2: float = Field(
        default=100000.0,
        gt=0.0,
        description="Total solar panel area in square meters"
    )
    efficiency: float = Field(
        default=0.20,
        ge=0.0,
        le=1.0,
        description="Solar panel efficiency (0.0-1.0)"
    )


class BatteryState(EnergySource):
    """State of battery storage system"""
    source_type: EnergySourceType = EnergySourceType.BATTERY
    max_capacity_mwh: float = Field(
        ...,
        gt=0.0,
        description="Maximum energy storage capacity in megawatt-hours"
    )
    current_charge_mwh: float = Field(
        default=0.0,
        ge=0.0,
        description="Current stored energy in megawatt-hours"
    )
    max_charge_rate_mw: float = Field(
        default=100.0,
        gt=0.0,
        description="Maximum charging rate in megawatts"
    )
    max_discharge_rate_mw: float = Field(
        default=100.0,
        gt=0.0,
        description="Maximum discharging rate in megawatts"
    )
    round_trip_efficiency: float = Field(
        default=0.95,
        ge=0.0,
        le=1.0,
        description="Battery round-trip efficiency (0.95 = 95%)"
    )
    
    @property
    def charge_level_percent(self) -> float:
        """Battery charge as percentage of capacity"""
        if self.max_capacity_mwh == 0:
            return 0.0
        return (self.current_charge_mwh / self.max_capacity_mwh) * 100
    
    @property
    def is_charging(self) -> bool:
        """Is the battery currently charging?"""
        return self.current_output_mw < 0  # Negative output = charging
    
    @property
    def is_discharging(self) -> bool:
        """Is the battery currently discharging?"""
        return self.current_output_mw > 0


class GasPlantState(EnergySource):
    """State of gas backup plant"""
    source_type: EnergySourceType = EnergySourceType.GAS
    fuel_cost_per_mwh: float = Field(
        default=150.0,
        ge=0.0,
        description="Cost of gas fuel per MWh generated"
    )
    co2_per_mwh: float = Field(
        default=0.5,
        ge=0.0,
        description="CO2 emissions in tons per MWh generated"
    )


class Metrics(BaseModel):
    """Performance and sustainability metrics"""
    renewable_energy_percent: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0,
        description="Percentage of demand met by renewable sources"
    )
    co2_emissions_kg: float = Field(
        default=0.0,
        ge=0.0,
        description="Total CO2 emissions in kilograms (this period)"
    )
    operational_cost_eur: float = Field(
        default=0.0,
        ge=0.0,
        description="Operational costs in EUR"
    )
    revenue_eur: float = Field(
        default=0.0,
        ge=0.0,
        description="Revenue from excess energy sales in EUR"
    )
    grid_uptime_percent: float = Field(
        default=100.0,
        ge=0.0,
        le=100.0,
        description="Percentage of time demand was met"
    )
    gas_activation_count: int = Field(
        default=0,
        ge=0,
        description="Number of times gas backup was activated"
    )
    battery_cycles: float = Field(
        default=0.0,
        ge=0.0,
        description="Number of full battery charge/discharge cycles"
    )


class GridState(BaseModel):
    """Complete state of the grid at a point in time"""
    timestamp: datetime = Field(
        default_factory=datetime.now,
        description="When this state was captured"
    )
    simulation_day: int = Field(
        default=1,
        ge=1,
        description="Which day of simulation (1, 2, 3...)"
    )
    
    # Environmental conditions
    weather: WeatherState
    
    # Demand
    demand: DemandState
    
    # Energy sources
    wind: WindTurbineState
    solar: SolarArrayState
    battery: BatteryState
    gas: GasPlantState
    
    # Metrics
    metrics: Metrics = Field(default_factory=Metrics)
    
    @property
    def total_generation_mw(self) -> float:
        """Total power being generated right now"""
        return (
            self.wind.current_output_mw +
            self.solar.current_output_mw +
            self.battery.current_output_mw +  # Can be negative if charging
            self.gas.current_output_mw
        )
    
    @property
    def total_renewable_mw(self) -> float:
        """Total renewable power generation (wind + solar + battery discharge)"""
        battery_contribution = max(0, self.battery.current_output_mw)  # Only count discharge
        return (
            self.wind.current_output_mw +
            self.solar.current_output_mw +
            battery_contribution
        )
    
    @property
    def supply_demand_balance(self) -> float:
        """Difference between supply and demand (+ = surplus, - = deficit)"""
        return self.total_generation_mw - self.demand.total_demand
    
    @property
    def is_grid_stable(self) -> bool:
        """Is the grid meeting demand?"""
        return self.supply_demand_balance >= 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2024-01-24T14:30:00",
                "simulation_day": 1,
                "weather": {
                    "wind_speed": 8.5,
                    "cloud_cover": 0.3,
                    "temperature": 12.0,
                    "time_of_day": 14.5
                },
                "demand": {
                    "base_load": 350.0,
                    "industrial_load": 50.0,
                    "heating_cooling_load": 30.0
                },
                "wind": {
                    "source_type": "wind",
                    "status": "online",
                    "capacity_mw": 450.0,
                    "current_output_mw": 320.0,
                    "num_turbines": 50,
                    "turbine_capacity_mw": 9.0
                },
                "solar": {
                    "source_type": "solar",
                    "status": "online",
                    "capacity_mw": 200.0,
                    "current_output_mw": 45.0
                },
                "battery": {
                    "source_type": "battery",
                    "status": "online",
                    "capacity_mw": 100.0,
                    "current_output_mw": 80.0,
                    "max_capacity_mwh": 400.0,
                    "current_charge_mwh": 256.0
                },
                "gas": {
                    "source_type": "gas",
                    "status": "standby",
                    "capacity_mw": 300.0,
                    "current_output_mw": 0.0
                }
            }
        }


# Example usage and testing
if __name__ == "__main__":
    # Create a sample grid state
    state = GridState(
        weather=WeatherState(
            wind_speed=8.5,
            cloud_cover=0.3,
            temperature=12.0,
            time_of_day=14.5
        ),
        demand=DemandState(
            base_load=350.0,
            industrial_load=50.0,
            heating_cooling_load=30.0
        ),
        wind=WindTurbineState(
            num_turbines=50,
            turbine_capacity_mw=9.0,
            current_output_mw=320.0
        ),
        solar=SolarArrayState(
            capacity_mw=200.0,
            current_output_mw=45.0
        ),
        battery=BatteryState(
            capacity_mw=100.0,
            max_capacity_mwh=400.0,
            current_charge_mwh=256.0,
            current_output_mw=80.0
        ),
        gas=GasPlantState(
            capacity_mw=300.0,
            current_output_mw=0.0
        )
    )
    
    # Print some info
    print("Grid State Example:")
    print(f"Total Demand: {state.demand.total_demand} MW")
    print(f"Total Generation: {state.total_generation_mw} MW")
    print(f"Balance: {state.supply_demand_balance:+.1f} MW")
    print(f"Grid Stable: {state.is_grid_stable}")
    print(f"Renewable %: {(state.total_renewable_mw / state.total_generation_mw * 100):.1f}%")
    print(f"Battery Charge: {state.battery.charge_level_percent:.1f}%")
    
    # Convert to JSON
    print("\nJSON representation:")
    print(state.model_dump_json(indent=2))