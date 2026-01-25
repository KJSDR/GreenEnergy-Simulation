"""
Demand Model

Calculates power demand based on time of day, temperature, and load types.
Residential demand peaks morning (8am) and evening (6pm).
"""

import math


class DemandModel:
    """Power demand calculator"""
    
    def __init__(
        self,
        base_load_mw: float = 300.0,
        peak_multiplier: float = 1.5,
        industrial_load_mw: float = 50.0,
        industrial_enabled: bool = True
    ):
        """
        Args:
            base_load_mw: Minimum constant load
            peak_multiplier: How much demand increases at peaks
            industrial_load_mw: Industrial facility load
            industrial_enabled: Is industrial load active?
        """
        self.base_load_mw = base_load_mw
        self.peak_multiplier = peak_multiplier
        self.industrial_load_mw = industrial_load_mw
        self.industrial_enabled = industrial_enabled
        
    def calculate_demand(
        self, 
        time_of_day: float, 
        temperature: float
    ) -> dict:
        """
        Calculate total demand
        
        Args:
            time_of_day: Hour (0-24)
            temperature: Temperature in Celsius
            
        Returns:
            dict with demand breakdown
        """
        # Residential demand curve (double peak: morning & evening)
        residential = self._residential_curve(time_of_day)
        
        # Industrial (constant if enabled)
        industrial = self.industrial_load_mw if self.industrial_enabled else 0.0
        
        # Temperature-dependent heating/cooling
        heating_cooling = self._temperature_load(temperature, time_of_day)
        
        total = residential + industrial + heating_cooling
        
        return {
            "base_load": residential,
            "industrial_load": industrial,
            "heating_cooling_load": heating_cooling,
            "total_demand": total
        }
    
    def _residential_curve(self, hour: float) -> float:
        """
        Residential load with morning and evening peaks
        Low at night (3am), peaks at 8am and 6pm
        """
        # Two sine waves offset to create double peak
        morning_peak = math.sin((hour - 8) * math.pi / 12) if 6 <= hour <= 10 else 0
        evening_peak = math.sin((hour - 18) * math.pi / 12) if 16 <= hour <= 22 else 0
        
        # Night time reduction (3am is lowest)
        night_factor = 0.6 if 0 <= hour < 6 or hour >= 23 else 1.0
        
        peak_factor = max(morning_peak, evening_peak)
        variation = (self.peak_multiplier - 1.0) * max(0, peak_factor)
        
        return self.base_load_mw * night_factor * (1.0 + variation)
    
    def _temperature_load(self, temp: float, hour: float) -> float:
        """
        Heating/cooling load based on temperature
        Only during daytime hours
        """
        # No heating/cooling at night
        if hour < 6 or hour >= 22:
            return 0.0
        
        # Heating needed when cold (<10°C)
        if temp < 10:
            heating = (10 - temp) * 3.0  # 3MW per degree below 10°C
            return min(heating, 50.0)  # Cap at 50MW
        
        # Cooling needed when hot (>20°C)
        elif temp > 20:
            cooling = (temp - 20) * 2.0  # 2MW per degree above 20°C
            return min(cooling, 30.0)  # Cap at 30MW
        
        return 0.0


# Test
if __name__ == "__main__":
    demand = DemandModel(base_load_mw=300.0)
    
    print("Demand Model - Typical Winter Day (5°C)\n")
    print("Time  | Residential | Industrial | Heating | Total")
    print("-" * 60)
    
    for hour in range(0, 25, 2):
        result = demand.calculate_demand(hour, 5.0)
        print(f"{hour:02d}:00 | {result['base_load']:7.1f} MW | "
              f"{result['industrial_load']:6.1f} MW | "
              f"{result['heating_cooling_load']:5.1f} MW | "
              f"{result['total_demand']:7.1f} MW")
    
    print("\n\nDemand Model - Hot Summer Day (28°C)\n")
    print("Time  | Residential | Industrial | Cooling | Total")
    print("-" * 60)
    
    for hour in range(0, 25, 2):
        result = demand.calculate_demand(hour, 28.0)
        print(f"{hour:02d}:00 | {result['base_load']:7.1f} MW | "
              f"{result['industrial_load']:6.1f} MW | "
              f"{result['heating_cooling_load']:5.1f} MW | "
              f"{result['total_demand']:7.1f} MW")