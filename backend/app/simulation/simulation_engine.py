"""
Simulation Engine

Orchestrates all components - runs the simulation tick by tick.
"""

from datetime import datetime
from app.models.grid_state import (
    GridState, WeatherState, DemandState,
    WindTurbineState, SolarArrayState, BatteryState, GasPlantState,
    Metrics, EnergySourceStatus
)
from app.simulation.time_manager import TimeManager
from app.simulation.weather_system import WeatherSystem
from app.simulation.demand_model import DemandModel
from app.simulation.grid_controller import GridController
from app.simulation.energy_sources.wind_turbine import WindTurbine
from app.simulation.energy_sources.solar_array import SolarArray
from app.simulation.energy_sources.battery import Battery
from app.simulation.energy_sources.gas_plant import GasPlant


class SimulationEngine:
    """Main simulation orchestrator"""
    
    def __init__(self):
        # Time management
        self.time = TimeManager(tick_duration_minutes=15)
        
        # Weather
        self.weather = WeatherSystem(
            initial_wind_speed=8.0,
            initial_cloud_cover=0.3,
            initial_temperature=12.0
        )
        
        # Demand
        self.demand = DemandModel(
            base_load_mw=300.0,
            industrial_enabled=True
        )
        
        # Energy sources
        self.wind = WindTurbine(rated_power_mw=9.0, num_turbines=50)
        self.solar = SolarArray(capacity_mw=200.0)
        self.battery = Battery(
            max_capacity_mwh=400.0,
            initial_charge_mwh=200.0
        )
        self.gas = GasPlant(capacity_mw=300.0)
        
        # Grid controller
        self.controller = GridController()
        
        # Metrics
        self.cumulative_metrics = {
            "total_renewable_mwh": 0.0,
            "total_demand_mwh": 0.0,
            "total_co2_kg": 0.0,
            "total_cost_eur": 0.0,
            "gas_activations": 0,
            "uptime_ticks": 0,
            "total_ticks": 0
        }
        
    def tick(self) -> GridState:
        """
        Advance simulation by one tick (15 minutes)
        
        Returns:
            Current grid state
        """
        # Update weather
        self.weather.update()
        
        # Calculate power generation
        wind_power, wind_status = self.wind.calculate_power(self.weather.wind_speed)
        solar_power, solar_status = self.solar.calculate_power(
            self.time.time_of_day,
            self.weather.cloud_cover
        )
        
        # Calculate demand
        demand_data = self.demand.calculate_demand(
            self.time.time_of_day,
            self.weather.temperature
        )
        total_demand = demand_data["total_demand"]
        
        # Balance grid
        balance_result = self.controller.balance_grid(
            demand_mw=total_demand,
            wind_output=wind_power,
            solar_output=solar_power,
            battery=self.battery,
            gas_plant=self.gas,
            duration_hours=self.time.tick_duration_minutes / 60.0
        )
        
        # Update cumulative metrics
        tick_hours = self.time.tick_duration_minutes / 60.0
        renewable_energy = (wind_power + solar_power) * tick_hours
        total_energy = total_demand * tick_hours
        
        self.cumulative_metrics["total_renewable_mwh"] += renewable_energy
        self.cumulative_metrics["total_demand_mwh"] += total_energy
        self.cumulative_metrics["total_co2_kg"] += self.gas.total_co2_tons * 1000
        self.cumulative_metrics["total_cost_eur"] += self.gas.total_fuel_cost_eur
        self.cumulative_metrics["total_ticks"] += 1
        
        if balance_result["grid_stable"]:
            self.cumulative_metrics["uptime_ticks"] += 1
        
        # Build grid state
        state = GridState(
            timestamp=datetime.now(),
            simulation_day=self.time.current_day,
            weather=WeatherState(
                wind_speed=self.weather.wind_speed,
                cloud_cover=self.weather.cloud_cover,
                temperature=self.weather.temperature,
                time_of_day=self.time.time_of_day
            ),
            demand=DemandState(
                base_load=demand_data["base_load"],
                industrial_load=demand_data["industrial_load"],
                heating_cooling_load=demand_data["heating_cooling_load"]
            ),
            wind=WindTurbineState(
                num_turbines=self.wind.num_turbines,
                turbine_capacity_mw=self.wind.rated_power_mw,
                current_output_mw=wind_power,
                status=EnergySourceStatus.ONLINE if wind_power > 0 else EnergySourceStatus.STANDBY
            ),
            solar=SolarArrayState(
                capacity_mw=self.solar.capacity_mw,
                current_output_mw=solar_power,
                status=EnergySourceStatus.ONLINE if solar_power > 0 else EnergySourceStatus.STANDBY
            ),
            battery=BatteryState(
                capacity_mw=self.battery.max_discharge_rate_mw,
                max_capacity_mwh=self.battery.max_capacity_mwh,
                current_charge_mwh=self.battery.current_charge_mwh,
                current_output_mw=balance_result["battery_action"],
                status=EnergySourceStatus.ONLINE
            ),
            gas=GasPlantState(
                capacity_mw=self.gas.capacity_mw,
                current_output_mw=self.gas.current_output_mw,
                status=EnergySourceStatus.ONLINE if self.gas.is_running else EnergySourceStatus.STANDBY
            ),
            metrics=Metrics(
                renewable_energy_percent=self._calculate_renewable_percent(),
                co2_emissions_kg=self.cumulative_metrics["total_co2_kg"],
                operational_cost_eur=self.cumulative_metrics["total_cost_eur"],
                grid_uptime_percent=self._calculate_uptime_percent(),
                gas_activation_count=self.gas.activation_count,
                battery_cycles=self.battery.total_cycles
            )
        )
        
        # Advance time
        self.time.tick()
        
        return state
    
    def _calculate_renewable_percent(self) -> float:
        """Calculate overall renewable percentage"""
        if self.cumulative_metrics["total_demand_mwh"] == 0:
            return 0.0
        return (self.cumulative_metrics["total_renewable_mwh"] / 
                self.cumulative_metrics["total_demand_mwh"]) * 100
    
    def _calculate_uptime_percent(self) -> float:
        """Calculate grid uptime percentage"""
        if self.cumulative_metrics["total_ticks"] == 0:
            return 100.0
        return (self.cumulative_metrics["uptime_ticks"] / 
                self.cumulative_metrics["total_ticks"]) * 100
    
    def reset(self):
        """Reset simulation to start"""
        self.time.reset()
        self.weather = WeatherSystem()
        self.battery = Battery(max_capacity_mwh=400.0, initial_charge_mwh=200.0)
        self.gas = GasPlant(capacity_mw=300.0)
        self.cumulative_metrics = {k: 0.0 for k in self.cumulative_metrics}


# Test
if __name__ == "__main__":
    sim = SimulationEngine()
    
    print("Simulation Engine Test - Running 24 hours\n")
    print("Time  | Wind  | Solar | Demand | Battery | Gas   | Renewable%")
    print("-" * 75)
    
    for i in range(96):  # 96 ticks = 24 hours at 15min intervals
        state = sim.tick()
        
        if i % 4 == 0:  # Print every hour
            print(f"{state.weather.time_of_day:05.2f} | "
                  f"{state.wind.current_output_mw:5.0f} | "
                  f"{state.solar.current_output_mw:5.0f} | "
                  f"{state.demand.total_demand:6.0f} | "
                  f"{state.battery.charge_level_percent:5.1f}% | "
                  f"{state.gas.current_output_mw:5.0f} | "
                  f"{state.metrics.renewable_energy_percent:5.1f}%")
    
    print(f"\n24-Hour Summary:")
    print(f"  Total CO2: {state.metrics.co2_emissions_kg:.1f} kg")
    print(f"  Total Cost: €{state.metrics.operational_cost_eur:.2f}")
    print(f"  Gas Activations: {state.metrics.gas_activation_count}")
    print(f"  Grid Uptime: {state.metrics.grid_uptime_percent:.1f}%")