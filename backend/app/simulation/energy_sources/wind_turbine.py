"""
Wind Turbine Power Generation

Calculates power output based on wind speed using realistic power curves.
Based on typical 9MW offshore wind turbine specifications.
"""

from typing import Tuple


class WindTurbine:
    """Wind turbine power generation calculator"""
    
    # Turbine specifications (typical 9MW offshore turbine)
    CUT_IN_SPEED = 3.0      # m/s - minimum wind to start generating
    RATED_SPEED = 12.0      # m/s - wind speed for maximum power
    CUT_OUT_SPEED = 25.0    # m/s - maximum safe wind speed
    
    def __init__(self, rated_power_mw: float = 9.0, num_turbines: int = 50):
        """
        Args:
            rated_power_mw: Maximum power per turbine in MW
            num_turbines: Number of turbines in the array
        """
        self.rated_power_mw = rated_power_mw
        self.num_turbines = num_turbines
        self.total_capacity_mw = rated_power_mw * num_turbines
        
    def calculate_power(self, wind_speed: float) -> Tuple[float, str]:
        """
        Calculate total power output for all turbines
        
        Args:
            wind_speed: Wind speed in m/s
            
        Returns:
            (power_output_mw, status_message)
        """
        # Safety shutdown - wind too strong
        if wind_speed >= self.CUT_OUT_SPEED:
            return 0.0, "shutdown_storm"
        
        # Too little wind to generate
        if wind_speed < self.CUT_IN_SPEED:
            return 0.0, "insufficient_wind"
        
        # Optimal range - rated power
        if self.RATED_SPEED <= wind_speed < self.CUT_OUT_SPEED:
            return self.total_capacity_mw, "rated_power"
        
        # Ramp-up range (3-12 m/s) - cubic relationship
        # Power increases with cube of wind speed in this range
        power_fraction = ((wind_speed - self.CUT_IN_SPEED) / 
                         (self.RATED_SPEED - self.CUT_IN_SPEED)) ** 3
        power_output = self.total_capacity_mw * power_fraction
        
        return power_output, "ramping"
    
    def get_capacity_factor(self, wind_speed: float) -> float:
        """
        Calculate capacity factor (percentage of max power)
        
        Args:
            wind_speed: Wind speed in m/s
            
        Returns:
            Capacity factor as percentage (0-100)
        """
        power_output, _ = self.calculate_power(wind_speed)
        if self.total_capacity_mw == 0:
            return 0.0
        return (power_output / self.total_capacity_mw) * 100


# Test the turbine model
if __name__ == "__main__":
    turbine = WindTurbine(rated_power_mw=9.0, num_turbines=50)
    
    print(f"Wind Turbine Array: {turbine.num_turbines}x {turbine.rated_power_mw}MW")
    print(f"Total Capacity: {turbine.total_capacity_mw}MW\n")
    
    # Test at different wind speeds
    test_speeds = [0, 2, 3, 5, 8, 12, 15, 20, 25, 30]
    
    print("Wind Speed | Power Output | Status")
    print("-" * 50)
    for speed in test_speeds:
        power, status = turbine.calculate_power(speed)
        capacity = turbine.get_capacity_factor(speed)
        print(f"{speed:4.0f} m/s   | {power:6.1f} MW ({capacity:5.1f}%) | {status}")