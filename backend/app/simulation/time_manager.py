"""
Time Manager - Handles simulation time advancement

The simulation runs in 15-minute ticks, advancing through 24-hour cycles.
"""

from datetime import datetime, timedelta
from typing import Optional


class TimeManager:
    """Manages simulation time advancement"""
    
    def __init__(self, tick_duration_minutes: int = 15, start_hour: float = 0.0):
        """
        Args:
            tick_duration_minutes: How many simulated minutes pass per tick
            start_hour: Starting hour of day (0.0 = midnight, 12.0 = noon)
        """
        self.tick_duration_minutes = tick_duration_minutes
        self.current_hour = start_hour
        self.current_day = 1
        self.total_ticks = 0
        
    def tick(self):
        """Advance time by one tick"""
        hours_per_tick = self.tick_duration_minutes / 60.0
        self.current_hour += hours_per_tick
        
        # Roll over to next day at 24:00
        if self.current_hour >= 24.0:
            self.current_hour -= 24.0
            self.current_day += 1
            
        self.total_ticks += 1
        
    @property
    def time_of_day(self) -> float:
        """Current hour (0.0-24.0)"""
        return self.current_hour
    
    @property
    def is_daytime(self) -> bool:
        """Is it daytime? (6am - 6pm)"""
        return 6.0 <= self.current_hour < 18.0
    
    @property
    def is_nighttime(self) -> bool:
        """Is it nighttime?"""
        return not self.is_daytime
    
    @property
    def solar_elevation_factor(self) -> float:
        """
        Solar elevation as 0-1 factor (0 = night, 1 = solar noon)
        Simple sine curve peaking at noon
        """
        if self.is_nighttime:
            return 0.0
        
        # Map 6am-6pm to 0-180 degrees
        hours_since_sunrise = self.current_hour - 6.0
        angle_radians = (hours_since_sunrise / 12.0) * 3.14159
        
        import math
        return math.sin(angle_radians)
    
    def reset(self):
        """Reset to start"""
        self.current_hour = 0.0
        self.current_day = 1
        self.total_ticks = 0


# Test it
if __name__ == "__main__":
    time_mgr = TimeManager(tick_duration_minutes=15)
    
    print("Time Manager Test:")
    print(f"Start: Day {time_mgr.current_day}, {time_mgr.current_hour:.2f}:00")
    
    # Simulate 24 hours (96 ticks at 15min each)
    for i in range(96):
        time_mgr.tick()
        if i % 4 == 0:  # Print every hour
            print(f"Tick {i+1}: Day {time_mgr.current_day}, "
                  f"{time_mgr.current_hour:.2f}:00, "
                  f"{'Day' if time_mgr.is_daytime else 'Night'}, "
                  f"Solar: {time_mgr.solar_elevation_factor:.2f}")
    
    print(f"\nAfter 24 hours: Day {time_mgr.current_day}, {time_mgr.current_hour:.2f}:00")