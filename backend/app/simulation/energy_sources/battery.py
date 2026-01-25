"""
Battery Storage System

Handles charging, discharging, and efficiency losses.
"""


class Battery:
    """Battery energy storage system"""
    
    def __init__(
        self,
        max_capacity_mwh: float = 400.0,
        max_charge_rate_mw: float = 100.0,
        max_discharge_rate_mw: float = 100.0,
        round_trip_efficiency: float = 0.95,
        initial_charge_mwh: float = 200.0
    ):
        """
        Args:
            max_capacity_mwh: Maximum energy storage in MWh
            max_charge_rate_mw: Maximum charging power in MW
            max_discharge_rate_mw: Maximum discharging power in MW
            round_trip_efficiency: Efficiency (0.95 = 95% efficient)
            initial_charge_mwh: Starting charge level
        """
        self.max_capacity_mwh = max_capacity_mwh
        self.max_charge_rate_mw = max_charge_rate_mw
        self.max_discharge_rate_mw = max_discharge_rate_mw
        self.round_trip_efficiency = round_trip_efficiency
        self.current_charge_mwh = min(initial_charge_mwh, max_capacity_mwh)
        self.total_cycles = 0.0
        
    def charge(self, power_mw: float, duration_hours: float) -> float:
        """
        Charge the battery
        
        Args:
            power_mw: Charging power in MW
            duration_hours: How long to charge (e.g., 0.25 for 15 min)
            
        Returns:
            Actual power consumed (accounting for limits)
        """
        # Limit to max charge rate
        actual_power = min(power_mw, self.max_charge_rate_mw)
        
        # Calculate energy with efficiency loss
        energy_stored = actual_power * duration_hours * self.round_trip_efficiency
        
        # Don't overcharge
        space_available = self.max_capacity_mwh - self.current_charge_mwh
        energy_stored = min(energy_stored, space_available)
        
        # Update charge level
        self.current_charge_mwh += energy_stored
        
        # Track cycles (1 cycle = full charge/discharge)
        self.total_cycles += energy_stored / self.max_capacity_mwh
        
        # Return actual power consumed from grid
        return energy_stored / (duration_hours * self.round_trip_efficiency) if duration_hours > 0 else 0
        
    def discharge(self, power_mw: float, duration_hours: float) -> float:
        """
        Discharge the battery
        
        Args:
            power_mw: Desired discharge power in MW
            duration_hours: How long to discharge
            
        Returns:
            Actual power supplied (accounting for limits and available charge)
        """
        # Limit to max discharge rate
        actual_power = min(power_mw, self.max_discharge_rate_mw)
        
        # Calculate energy needed (with efficiency loss)
        energy_needed = actual_power * duration_hours / self.round_trip_efficiency
        
        # Don't over-discharge
        energy_available = self.current_charge_mwh
        energy_used = min(energy_needed, energy_available)
        
        # Update charge level
        self.current_charge_mwh -= energy_used
        
        # Track cycles
        self.total_cycles += energy_used / self.max_capacity_mwh
        
        # Return actual power supplied to grid
        return energy_used * self.round_trip_efficiency / duration_hours if duration_hours > 0 else 0
    
    @property
    def charge_percent(self) -> float:
        """Current charge as percentage"""
        return (self.current_charge_mwh / self.max_capacity_mwh) * 100
    
    @property
    def is_full(self) -> bool:
        """Is battery at capacity?"""
        return self.current_charge_mwh >= self.max_capacity_mwh * 0.99
    
    @property
    def is_empty(self) -> bool:
        """Is battery depleted?"""
        return self.current_charge_mwh <= self.max_capacity_mwh * 0.05


# Test
if __name__ == "__main__":
    battery = Battery(
        max_capacity_mwh=400.0,
        max_charge_rate_mw=100.0,
        initial_charge_mwh=200.0
    )
    
    print(f"Battery: {battery.max_capacity_mwh}MWh capacity")
    print(f"Initial charge: {battery.charge_percent:.1f}%\n")
    
    # Simulate charging for 1 hour
    print("Charging at 80MW for 1 hour:")
    power_used = battery.charge(80.0, 1.0)
    print(f"  Power consumed: {power_used:.1f}MW")
    print(f"  New charge: {battery.charge_percent:.1f}%")
    print(f"  Energy stored: {battery.current_charge_mwh:.1f}MWh\n")
    
    # Simulate discharging
    print("Discharging at 100MW for 2 hours:")
    power_supplied = battery.discharge(100.0, 2.0)
    print(f"  Power supplied: {power_supplied:.1f}MW")
    print(f"  New charge: {battery.charge_percent:.1f}%")
    print(f"  Energy remaining: {battery.current_charge_mwh:.1f}MWh")
    print(f"  Total cycles: {battery.total_cycles:.2f}")