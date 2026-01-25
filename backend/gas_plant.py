"""
Gas Backup Plant

Dispatchable power source - expensive but reliable.
Tracks fuel costs and CO2 emissions.
"""


class GasPlant:
    """Natural gas backup power plant"""
    
    def __init__(
        self,
        capacity_mw: float = 300.0,
        fuel_cost_per_mwh: float = 150.0,
        co2_per_mwh_tons: float = 0.5,
        ramp_rate_mw_per_min: float = 10.0
    ):
        """
        Args:
            capacity_mw: Maximum power output
            fuel_cost_per_mwh: Fuel cost in EUR per MWh generated
            co2_per_mwh_tons: CO2 emissions in tons per MWh
            ramp_rate_mw_per_min: How fast plant can ramp up/down
        """
        self.capacity_mw = capacity_mw
        self.fuel_cost_per_mwh = fuel_cost_per_mwh
        self.co2_per_mwh_tons = co2_per_mwh_tons
        self.ramp_rate_mw_per_min = ramp_rate_mw_per_min
        self.current_output_mw = 0.0
        self.total_runtime_hours = 0.0
        self.total_fuel_cost_eur = 0.0
        self.total_co2_tons = 0.0
        self.activation_count = 0
        
    def set_output(self, target_mw: float, duration_hours: float) -> float:
        """
        Set gas plant output (accounts for ramp rate)
        
        Args:
            target_mw: Desired output power
            duration_hours: Time period for this setting
            
        Returns:
            Actual output achieved
        """
        # Limit to capacity
        target_mw = min(target_mw, self.capacity_mw)
        
        # Calculate max change based on ramp rate
        duration_minutes = duration_hours * 60
        max_change = self.ramp_rate_mw_per_min * duration_minutes
        
        # Apply ramp limit
        if target_mw > self.current_output_mw:
            actual_output = min(target_mw, self.current_output_mw + max_change)
        else:
            actual_output = max(target_mw, self.current_output_mw - max_change)
        
        # Track activation
        if self.current_output_mw == 0 and actual_output > 0:
            self.activation_count += 1
        
        self.current_output_mw = actual_output
        
        # Track costs and emissions if running
        if actual_output > 0:
            energy_mwh = actual_output * duration_hours
            self.total_runtime_hours += duration_hours
            self.total_fuel_cost_eur += energy_mwh * self.fuel_cost_per_mwh
            self.total_co2_tons += energy_mwh * self.co2_per_mwh_tons
            
        return actual_output
    
    def shutdown(self):
        """Emergency shutdown"""
        self.current_output_mw = 0.0
        
    @property
    def is_running(self) -> bool:
        """Is the plant currently generating?"""
        return self.current_output_mw > 0
    
    @property
    def capacity_factor(self) -> float:
        """Current output as percentage of capacity"""
        return (self.current_output_mw / self.capacity_mw) * 100


# Test
if __name__ == "__main__":
    gas = GasPlant(capacity_mw=300.0)
    
    print(f"Gas Plant: {gas.capacity_mw}MW capacity")
    print(f"Fuel cost: €{gas.fuel_cost_per_mwh}/MWh")
    print(f"CO2: {gas.co2_per_mwh_tons} tons/MWh\n")
    
    # Simulate ramp up
    print("Ramping up to 200MW over 15 minutes:")
    output = gas.set_output(200.0, 0.25)  # 15 min = 0.25 hours
    print(f"  Achieved: {output:.1f}MW")
    print(f"  Cost: €{gas.total_fuel_cost_eur:.2f}")
    print(f"  CO2: {gas.total_co2_tons:.3f} tons\n")
    
    # Continue for 1 hour
    print("Running at 200MW for 1 hour:")
    output = gas.set_output(200.0, 1.0)
    print(f"  Output: {output:.1f}MW")
    print(f"  Total cost: €{gas.total_fuel_cost_eur:.2f}")
    print(f"  Total CO2: {gas.total_co2_tons:.3f} tons")
    print(f"  Activations: {gas.activation_count}")