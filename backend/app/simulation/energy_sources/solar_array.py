"""
Solar Array Power Generation

Calculates solar power output based on time of day and cloud cover.
"""

import math


class SolarArray:
    """Solar panel array power generation calculator"""
    
    def __init__(
        self, 
        capacity_mw: float = 200.0,
        panel_efficiency: float = 0.20
    ):
        """
        Args:
            capacity_mw: Maximum power output at perfect conditions
            panel_efficiency: Solar panel efficiency (0.0-1.0)
        """
        self.capacity_mw = capacity_mw
        self.panel_efficiency = panel_efficiency
        
    def calculate_power(
        self, 
        time_of_day: float, 
        cloud_cover: float
    ) -> tuple[float, str]:
        """
        Calculate solar power output
        
        Args:
            time_of_day: Hour of day (0.0-24.0)
            cloud_cover: Cloud coverage (0.0 = clear, 1.0 = overcast)
            
        Returns:
            (power_output_mw, status_message)
        """
        # Night time - no solar
        if time_of_day < 6.0 or time_of_day >= 18.0:
            return 0.0, "nighttime"
        
        # Calculate sun elevation (0-1, peaks at solar noon)
        hours_since_sunrise = time_of_day - 6.0
        angle_radians = (hours_since_sunrise / 12.0) * math.pi
        sun_elevation = math.sin(angle_radians)
        
        # Cloud cover reduces output
        cloud_factor = 1.0 - (cloud_cover * 0.8)  # 80% reduction at full cloud
        
        # Calculate power
        base_power = self.capacity_mw * sun_elevation
        actual_power = base_power * cloud_factor
        
        # Determine status
        if cloud_cover > 0.7:
            status = "cloudy"
        elif cloud_cover > 0.3:
            status = "partly_cloudy"
        else:
            status = "clear"
            
        return actual_power, status


# Test
if __name__ == "__main__":
    solar = SolarArray(capacity_mw=200.0)
    
    print(f"Solar Array: {solar.capacity_mw}MW capacity\n")
    
    # Test throughout the day
    print("Time  | Clear Sky | Cloudy (50%) | Overcast (90%)")
    print("-" * 55)
    
    for hour in range(0, 25, 2):
        power_clear, _ = solar.calculate_power(hour, 0.0)
        power_cloudy, _ = solar.calculate_power(hour, 0.5)
        power_overcast, _ = solar.calculate_power(hour, 0.9)
        
        print(f"{hour:02d}:00 | {power_clear:6.1f} MW | {power_cloudy:8.1f} MW | {power_overcast:10.1f} MW")