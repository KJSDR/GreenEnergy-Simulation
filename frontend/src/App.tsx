import React from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Layout } from './components/Layout';
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">⚡ Renewable Grid Simulator</h1>
            <p className="text-gray-400 text-sm">
              Real-time renewable energy management
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              gridState.metrics?.renewable_energy_percent > 80 ? 'text-green-400' :
              gridState.metrics?.renewable_energy_percent > 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {gridState.metrics?.renewable_energy_percent?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-sm text-gray-400">Renewable Energy</p>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <Layout
        leftPanel={<Scene gridState={gridState} />}
        rightPanel={
          <div className="p-6 space-y-6">
            
            {/* Key Metrics */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">📊 Grid Status</h2>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Supply & Demand */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Power Flow</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Demand</span>
                      <span className="font-mono font-medium">{gridState.demand?.total_demand?.toFixed(0) || '0'} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Supply</span>
                      <span className="font-mono font-medium">{gridState.total_generation_mw?.toFixed(0) || '0'} MW</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-gray-300">Balance</span>
                      <span className={`font-mono font-bold ${gridState.is_grid_stable ? 'text-green-400' : 'text-red-400'}`}>
                        {gridState.supply_demand_balance >= 0 ? '+' : ''}{gridState.supply_demand_balance?.toFixed(0) || '0'} MW
                      </span>
                    </div>
                  </div>
                </div>

                {/* Energy Mix */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Energy Sources</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">💨 Wind</span>
                      <span className="font-mono text-blue-400 font-medium">{gridState.wind?.current_output_mw?.toFixed(0) || '0'} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">☀️ Solar</span>
                      <span className="font-mono text-yellow-400 font-medium">{gridState.solar?.current_output_mw?.toFixed(0) || '0'} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">🔋 Battery</span>
                      <span className="font-mono text-green-400 font-medium">
                        {gridState.battery?.current_output_mw?.toFixed(0) || '0'} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">🏭 Gas</span>
                      <span className="font-mono text-red-400 font-medium">{gridState.gas?.current_output_mw?.toFixed(0) || '0'} MW</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CO2 Impact */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">CO₂ Emissions (Total)</p>
                    <p className="text-2xl font-bold">{((gridState.metrics?.co2_emissions_kg || 0) / 1000).toFixed(1)} tons</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Grid Status</p>
                    <p className={`text-lg font-bold ${gridState.is_grid_stable ? 'text-green-400' : 'text-red-400'}`}>
                      {gridState.is_grid_stable ? '✅ STABLE' : '⚠️ UNSTABLE'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Conditions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">🌤️ Current Conditions</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Wind Speed</p>
                  <p className="text-xl font-bold">{gridState.weather?.wind_speed?.toFixed(1) || '0.0'} m/s</p>
                </div>
                <div>
                  <p className="text-gray-400">Cloud Cover</p>
                  <p className="text-xl font-bold">{((gridState.weather?.cloud_cover || 0) * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Time</p>
                  <p className="text-xl font-bold">{gridState.weather?.time_of_day?.toFixed(2) || '0.00'}:00</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div>
              <h2 className="text-xl font-semibold text-gray-300 mb-4">📈 Performance</h2>
              <ChartsPanel gridState={gridState} />
            </div>

            {/* Instructions */}
            <div className="bg-gray-700 rounded-lg p-4 text-sm text-gray-300">
              <p className="font-medium mb-2">💡 Interactive Controls:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Click wind turbines to adjust wind speed</li>
                <li>• Click solar panels to change weather conditions</li>
                <li>• Click city buildings to toggle industrial demand</li>
              </ul>
            </div>

          </div>
        }
      />
    </div>
  );
}

export default App;