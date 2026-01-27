import React from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Layout } from './components/Layout';
import { Scene } from './components/VisualScene/Scene';
import { ChartsPanel } from './components/Dashboard/ChartsPanel';
import { ScenarioControls } from './components/Controls/ScenarioControls';
import { SpeedControls } from './components/Controls/SpeedControls';
import { StatsSummary } from './components/Dashboard/StatsSummary';

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
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">⚡ Renewable Grid Simulator</h1>
            <p className="text-gray-400 text-sm">
              Day {gridState.simulation_day || 1} • {gridState.weather?.time_of_day?.toFixed(2) || '0.00'}:00
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Real-time Simulation</p>
            <p className={`text-sm font-medium ${gridState.is_grid_stable ? 'text-green-400' : 'text-red-400'}`}>
              {gridState.is_grid_stable ? '● ONLINE' : '● UNSTABLE'}
            </p>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <Layout
        leftPanel={<Scene gridState={gridState} />}
        rightPanel={
          <div className="p-6 space-y-6">
            
            {/* Controls Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-300">Controls</h2>
              <SpeedControls />
              <ScenarioControls />
            </div>

            {/* Stats Summary */}
            <StatsSummary gridState={gridState} />

            {/* Status Cards - Compact */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Grid Status */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold mb-3 text-gray-400">⚡ GRID STATUS</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Demand</span>
                    <span className="font-mono font-medium">{gridState.demand?.total_demand?.toFixed(0) || '0'} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Supply</span>
                    <span className="font-mono font-medium">{gridState.total_generation_mw?.toFixed(0) || '0'} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Balance</span>
                    <span className={`font-mono font-medium ${gridState.is_grid_stable ? 'text-green-400' : 'text-red-400'}`}>
                      {gridState.supply_demand_balance >= 0 ? '+' : ''}{gridState.supply_demand_balance?.toFixed(0) || '0'} MW
                    </span>
                  </div>
                </div>
              </div>

              {/* Energy Sources */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold mb-3 text-gray-400">🌍 ENERGY SOURCES</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">💨 Wind</span>
                    <span className="font-mono text-blue-400 font-medium">{gridState.wind?.current_output_mw?.toFixed(0) || '0'} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">☀️ Solar</span>
                    <span className="font-mono text-yellow-400 font-medium">{gridState.solar?.current_output_mw?.toFixed(0) || '0'} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🔋 Battery</span>
                    <span className="font-mono text-green-400 font-medium">
                      {gridState.battery?.current_output_mw?.toFixed(0) || '0'} MW ({((gridState.battery?.current_charge_mwh / gridState.battery?.max_capacity_mwh * 100) || 0).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🏭 Gas</span>
                    <span className="font-mono text-red-400 font-medium">{gridState.gas?.current_output_mw?.toFixed(0) || '0'} MW</span>
                  </div>
                </div>
              </div>

              {/* Weather */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold mb-3 text-gray-400">🌤️ WEATHER</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wind Speed</span>
                    <span className="font-mono font-medium">{gridState.weather?.wind_speed?.toFixed(1) || '0.0'} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cloud Cover</span>
                    <span className="font-mono font-medium">{((gridState.weather?.cloud_cover || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temperature</span>
                    <span className="font-mono font-medium">{gridState.weather?.temperature?.toFixed(1) || '0.0'}°C</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold mb-3 text-gray-400">📊 SESSION METRICS</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Renewable %</span>
                    <span className="font-mono text-green-400 font-medium">{gridState.metrics?.renewable_energy_percent?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CO₂ Total</span>
                    <span className="font-mono font-medium">{((gridState.metrics?.co2_emissions_kg || 0) / 1000).toFixed(1)} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost Total</span>
                    <span className="font-mono font-medium">€{(gridState.metrics?.operational_cost_eur / 1000 || 0).toFixed(0)}k</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Charts Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-300 mb-4">Analytics</h2>
              <ChartsPanel gridState={gridState} />
            </div>

          </div>
        }
      />
    </div>
  );
}

export default App;