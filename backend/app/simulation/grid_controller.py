"""
Grid Controller

The "brain" of the simulation - balances supply and demand automatically.
Prioritizes renewables, uses battery smartly, activates gas as last resort.
"""


class GridController:
    """Intelligent grid balancing system"""
    
    def __init__(self):
        self.gas_active = False
        
    def balance_grid(
        self,
        demand_mw: float,
        wind_output: float,
        solar_output: float,
        battery,
        gas_plant,
        duration_hours: float = 0.25  # 15 min default
    ) -> dict:
        """
        Balance supply and demand
        
        Args:
            demand_mw: Total power demand
            wind_output: Available wind power
            solar_output: Available solar power
            battery: Battery object
            gas_plant: GasPlant object
            duration_hours: Time period
            
        Returns:
            dict with balancing results
        """
        # Calculate renewable supply
        renewable_supply = wind_output + solar_output
        
        # Calculate surplus/deficit
        balance = renewable_supply - demand_mw
        
        battery_action = 0.0  # Positive = discharge, negative = charge
        gas_output = 0.0
        
        # SURPLUS - charge battery
        if balance > 0:
            surplus = balance
            power_charged = battery.charge(surplus, duration_hours)
            battery_action = -power_charged  # Negative = charging
            
        # DEFICIT - try battery first, then gas
        else:
            deficit = abs(balance)
            
            # Try battery
            power_from_battery = battery.discharge(deficit, duration_hours)
            battery_action = power_from_battery
            deficit -= power_from_battery
            
            # Still short? Activate gas
            if deficit > 0.1:  # Small tolerance
                gas_output = gas_plant.set_output(deficit, duration_hours)
                self.gas_active = True
            else:
                gas_plant.set_output(0.0, duration_hours)
                self.gas_active = False
        
        # Calculate metrics
        total_supply = renewable_supply + battery_action + gas_output
        renewable_percent = 0.0
        if total_supply > 0:
            renewable_contribution = renewable_supply + max(0, battery_action)
            renewable_percent = (renewable_contribution / total_supply) * 100
        
        return {
            "demand": demand_mw,
            "wind_output": wind_output,
            "solar_output": solar_output,
            "battery_action": battery_action,  # + discharge, - charge
            "gas_output": gas_output,
            "total_supply": total_supply,
            "balance": total_supply - demand_mw,
            "renewable_percent": renewable_percent,
            "grid_stable": total_supply >= demand_mw
        }


# Test
if __name__ == "__main__":
    from energy_sources.battery import Battery
    from energy_sources.gas_plant import GasPlant
    
    controller = GridController()
    battery = Battery(max_capacity_mwh=400.0, initial_charge_mwh=200.0)
    gas = GasPlant(capacity_mw=300.0)
    
    print("Grid Controller Test\n")
    
    # Scenario 1: Surplus (high wind)
    print("Scenario 1: High wind, charge battery")
    result = controller.balance_grid(
        demand_mw=400.0,
        wind_output=500.0,
        solar_output=50.0,
        battery=battery,
        gas_plant=gas
    )
    print(f"  Demand: {result['demand']:.1f} MW")
    print(f"  Supply: {result['total_supply']:.1f} MW")
    print(f"  Battery: {result['battery_action']:.1f} MW (charging)")
    print(f"  Gas: {result['gas_output']:.1f} MW")
    print(f"  Renewable: {result['renewable_percent']:.1f}%\n")
    
    # Scenario 2: Deficit (low wind, use battery)
    print("Scenario 2: Low wind, discharge battery")
    result = controller.balance_grid(
        demand_mw=450.0,
        wind_output=300.0,
        solar_output=50.0,
        battery=battery,
        gas_plant=gas
    )
    print(f"  Demand: {result['demand']:.1f} MW")
    print(f"  Supply: {result['total_supply']:.1f} MW")
    print(f"  Battery: {result['battery_action']:.1f} MW (discharging)")
    print(f"  Gas: {result['gas_output']:.1f} MW")
    print(f"  Renewable: {result['renewable_percent']:.1f}%\n")
    
    # Scenario 3: Big deficit (need gas)
    print("Scenario 3: Very low wind, need gas backup")
    result = controller.balance_grid(
        demand_mw=450.0,
        wind_output=50.0,
        solar_output=0.0,
        battery=battery,
        gas_plant=gas
    )
    print(f"  Demand: {result['demand']:.1f} MW")
    print(f"  Supply: {result['total_supply']:.1f} MW")
    print(f"  Battery: {result['battery_action']:.1f} MW")
    print(f"  Gas: {result['gas_output']:.1f} MW")
    print(f"  Renewable: {result['renewable_percent']:.1f}%")