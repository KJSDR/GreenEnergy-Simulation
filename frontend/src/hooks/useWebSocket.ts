/**
 * WebSocket Hook
 * 
 * Connects to backend WebSocket and manages real-time state updates
 */

import { useEffect, useState, useRef } from 'react';

interface GridState {
  timestamp: string;
  simulation_day: number;
  weather: {
    wind_speed: number;
    cloud_cover: number;
    temperature: number;
    time_of_day: number;
  };
  demand: {
    base_load: number;
    industrial_load: number;
    heating_cooling_load: number;
    total_demand: number;
  };
  wind: {
    source_type: string;
    status: string;
    capacity_mw: number;
    current_output_mw: number;
    num_turbines: number;
  };
  solar: {
    source_type: string;
    status: string;
    capacity_mw: number;
    current_output_mw: number;
  };
  battery: {
    source_type: string;
    status: string;
    capacity_mw: number;
    current_output_mw: number;
    max_capacity_mwh: number;
    current_charge_mwh: number;
    charge_level_percent: number;
  };
  gas: {
    source_type: string;
    status: string;
    capacity_mw: number;
    current_output_mw: number;
  };
  metrics: {
    renewable_energy_percent: number;
    co2_emissions_kg: number;
    operational_cost_eur: number;
    grid_uptime_percent: number;
    gas_activation_count: number;
    battery_cycles: number;
  };
  total_generation_mw: number;
  supply_demand_balance: number;
  is_grid_stable: boolean;
}

export const useWebSocket = () => {
  const [gridState, setGridState] = useState<GridState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'state_update') {
        setGridState(message.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return { gridState, isConnected };
};