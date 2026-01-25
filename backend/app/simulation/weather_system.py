"""
Weather System

Simulates wind speed and cloud cover with realistic variations.
"""

import random


class WeatherSystem:
    """Dynamic weather simulator"""
    
    def __init__(
        self,
        initial_wind_speed: float = 8.0,
        initial_cloud_cover: float = 0.3,
        initial_temperature: float = 12.0
    ):
        """
        Args:
            initial_wind_speed: Starting wind in m/s
            initial_cloud_cover: Starting clouds (0.0-1.0)
            initial_temperature: Starting temp in °C
        """
        self.wind_speed = initial_wind_speed
        self.cloud_cover = initial_cloud_cover
        self.temperature = initial_temperature
        
    def update(self):
        """Update weather conditions (call each tick)"""
        # Wind: random walk with drift back to mean
        mean_wind = 8.0
        drift = (mean_wind - self.wind_speed) * 0.05
        change = random.uniform(-0.8, 0.8) + drift
        self.wind_speed = max(0, min(30, self.wind_speed + change))
        
        # Clouds: slower changes
        if random.random() < 0.15:  # 15% chance to change
            change = random.uniform(-0.15, 0.15)
            self.cloud_cover = max(0, min(1, self.cloud_cover + change))
        
        # Temperature: very slow drift
        if random.random() < 0.05:
            change = random.uniform(-0.5, 0.5)
            self.temperature = max(-10, min(35, self.temperature + change))
    
    def set_wind(self, speed: float):
        """Manually set wind speed"""
        self.wind_speed = max(0, min(30, speed))
        
    def set_clouds(self, cover: float):
        """Manually set cloud cover"""
        self.cloud_cover = max(0, min(1, cover))
        
    def set_temperature(self, temp: float):
        """Manually set temperature"""
        self.temperature = max(-30, min(50, temp))
    
    def trigger_storm(self):
        """Simulate storm conditions"""
        self.wind_speed = random.uniform(20, 28)
        self.cloud_cover = random.uniform(0.8, 1.0)
        
    def trigger_calm(self):
        """Simulate calm weather"""
        self.wind_speed = random.uniform(0, 2)
        self.cloud_cover = random.uniform(0, 0.3)


# Test
if __name__ == "__main__":
    weather = WeatherSystem()
    
    print("Weather System - 24 hour simulation\n")
    print("Hour | Wind (m/s) | Clouds (%) | Temp (°C)")
    print("-" * 50)
    
    for hour in range(25):
        print(f"{hour:2d}:00 | {weather.wind_speed:6.2f}    | "
              f"{weather.cloud_cover*100:6.1f}    | "
              f"{weather.temperature:6.1f}")
        
        # Update every 4 ticks per hour (15 min intervals)
        for _ in range(4):
            weather.update()
    
    print("\n\nTesting storm trigger:")
    weather.trigger_storm()
    print(f"Wind: {weather.wind_speed:.1f} m/s")
    print(f"Clouds: {weather.cloud_cover*100:.1f}%")