import React from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Scene } from './components/VisualScene/Scene';
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
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Compact Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold">⚡ Renewable Grid Simulator</h1>
          <p className="text-xs text-gray-400">Click elements to control • Real-time simulation</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${
            gridState.metrics?.renewable_energy_percent > 80 ? 'text-green-400' :
            gridState.metrics?.renewable_energy_percent > 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {gridState.metrics?.renewable_energy_percent?.toFixed(1) || '0.0'}%
          </div>
          <p className="text-xs text-gray-400">Renewable Energy</p>
        </div>
      </header>

      {/* Split Screen Layout - Fixed Height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Visual Scene */}
        <div className="w-1/2 border-r border-gray-700">
          <Scene gridState={gridState} />
        </div>

        {/* Right: Compact Dashboard - EXACTLY fits screen */}
        <div className="w-1/2 p-4 flex flex-col gap-3 overflow-hidden">
          
          {/* Grid Status */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Grid Status</h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Supply & Demand */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Demand</span>
                  <span className="font-mono font-medium">{gridState.demand?.total_demand?.toFixed(0) || '0'} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply</span>
                  <span className="font-mono font-medium">{gridState.total_generation_mw?.toFixed(0) || '0'} MW</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-700">
                  <span className="text-gray-400">Balance</span>
                  <span className={`font-mono font-bold ${gridState.is_grid_stable ? 'text-green-400' : 'text-red-400'}`}>
                    {gridState.supply_demand_balance >= 0 ? '+' : ''}{gridState.supply_demand_balance?.toFixed(0) || '0'} MW
                  </span>
                </div>
              </div>

              {/* Energy Sources */}
              <div className="space-y-1">
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
                  <span className="font-mono text-green-400 font-medium">{gridState.battery?.current_output_mw?.toFixed(0) || '0'} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">🏭 Gas</span>
                  <span className="font-mono text-red-400 font-medium">{gridState.gas?.current_output_mw?.toFixed(0) || '0'} MW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Conditions */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Current Conditions</h3>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Wind</p>
                <p className="text-base font-bold">{gridState.weather?.wind_speed?.toFixed(1) || '0.0'} m/s</p>
              </div>
              <div>
                <p className="text-gray-400">Clouds</p>
                <p className="text-base font-bold">{((gridState.weather?.cloud_cover || 0) * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Time</p>
                <p className="text-base font-bold">{gridState.weather?.time_of_day?.toFixed(2)}:00</p>
              </div>
              <div>
                <p className="text-gray-400">CO₂</p>
                <p className="text-base font-bold">{((gridState.metrics?.co2_emissions_kg || 0) / 1000).toFixed(1)}t</p>
              </div>
            </div>
          </div>

          {/* Charts - Takes remaining space */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Performance</h3>
            <div className="h-[calc(100%-2rem)]">
              <ChartsPanel gridState={gridState} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;