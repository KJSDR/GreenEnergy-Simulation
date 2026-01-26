import React from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { ChartsPanel } from './components/Dashboard/ChartsPanel';

function App() {
  const { gridState, isConnected } = useWebSocket();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">⚡</div>
          <p>Connecting to simulation...</p>
        </div>
      </div>
    );
  }

  if (!gridState) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading grid state...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">Renewable Grid Simulator - LIVE</h1>
        <p className="text-gray-400 text-sm">
          Day {gridState.simulation_day || 1} • {gridState.weather?.time_of_day?.toFixed(2) || '0.00'}:00
        </p>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-2 gap-6">
          
          {/* Grid Status */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">⚡ Grid Status</h2>
            <div className="space-y-2">
              <p>Demand: <span className="font-mono">{gridState.demand?.total_demand?.toFixed(0) || '0'} MW</span></p>
              <p>Supply: <span className="font-mono">{gridState.total_generation_mw?.toFixed(0) || '0'} MW</span></p>
              <p>Balance: <span className={gridState.is_grid_stable ? 'text-green-400' : 'text-red-400'}>
                {gridState.supply_demand_balance >= 0 ? '+' : ''}{gridState.supply_demand_balance?.toFixed(0) || '0'} MW
              </span></p>
              <p>Status: {gridState.is_grid_stable ? 
                <span className="text-green-400">✅ Stable</span> : 
                <span className="text-red-400">⚠️ Unstable</span>
              }</p>
            </div>
          </div>

          {/* Energy Sources */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🌍 Energy Sources</h2>
            <div className="space-y-2">
              <p>💨 Wind: <span className="font-mono text-blue-400">{gridState.wind?.current_output_mw?.toFixed(0) || '0'} MW</span></p>
              <p>☀️ Solar: <span className="font-mono text-yellow-400">{gridState.solar?.current_output_mw?.toFixed(0) || '0'} MW</span></p>
              <p>🔋 Battery: <span className="font-mono text-green-400">
                {gridState.battery?.current_output_mw?.toFixed(0) || '0'} MW 
                ({((gridState.battery?.current_charge_mwh / gridState.battery?.max_capacity_mwh * 100) || 0).toFixed(0)}%)
              </span></p>
              <p>🏭 Gas: <span className="font-mono text-red-400">{gridState.gas?.current_output_mw?.toFixed(0) || '0'} MW</span></p>
            </div>
          </div>

          {/* Weather */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🌤️ Weather</h2>
            <div className="space-y-2">
              <p>Wind Speed: <span className="font-mono">{gridState.weather?.wind_speed?.toFixed(1) || '0.0'} m/s</span></p>
              <p>Cloud Cover: <span className="font-mono">{((gridState.weather?.cloud_cover || 0) * 100).toFixed(0)}%</span></p>
              <p>Temperature: <span className="font-mono">{gridState.weather?.temperature?.toFixed(1) || '0.0'}°C</span></p>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📊 Metrics</h2>
            <div className="space-y-2">
              <p>Renewable: <span className="font-mono text-green-400">{gridState.metrics?.renewable_energy_percent?.toFixed(1) || '0.0'}%</span></p>
              <p>CO₂: <span className="font-mono">{((gridState.metrics?.co2_emissions_kg || 0) / 1000).toFixed(1)} tons</span></p>
              <p>Cost: <span className="font-mono">€{gridState.metrics?.operational_cost_eur?.toFixed(0) || '0'}</span></p>
              <p>Gas Events: <span className="font-mono">{gridState.metrics?.gas_activation_count || 0}</span></p>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="mt-6">
          <ChartsPanel gridState={gridState} />
        </div>

      </main>
    </div>
  );
}

export default App;