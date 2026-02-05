/**
 * Stats Summary
 * 
 * High-level KPIs displayed prominently
 */

import React from 'react';

interface GridState {
  metrics?: {
    renewable_energy_percent?: number;
    co2_emissions_kg?: number;
    operational_cost_eur?: number;
    grid_uptime_percent?: number;
    gas_activation_count?: number;
  };
  is_grid_stable?: boolean;
  supply_demand_balance?: number;
}

interface StatsSummaryProps {
  gridState: GridState;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ gridState }) => {
  const renewablePercent = gridState.metrics?.renewable_energy_percent || 0;
  const co2Emissions = gridState.metrics?.co2_emissions_kg || 0;
  const operatingCost = gridState.metrics?.operational_cost_eur || 0;
  const gridUptime = gridState.metrics?.grid_uptime_percent || 0;
  const gasActivations = gridState.metrics?.gas_activation_count || 0;
  const balance = gridState.supply_demand_balance || 0;
  
  const stats = [
    {
      label: 'Renewable Energy',
      value: `${renewablePercent.toFixed(1)}%`,
      color: renewablePercent > 80 ? 'text-green-400' : 
             renewablePercent > 50 ? 'text-yellow-400' : 'text-red-400',
      icon: '♻️'
    },
    {
      label: 'Grid Status',
      value: gridState.is_grid_stable ? 'STABLE' : 'UNSTABLE',
      color: gridState.is_grid_stable ? 'text-green-400' : 'text-red-400',
      icon: gridState.is_grid_stable ? '✅' : '⚠️'
    },
    {
      label: 'CO₂ Emissions',
      value: `${(co2Emissions / 1000).toFixed(1)} tons`,
      color: 'text-gray-300',
      icon: '💨'
    },
    {
      label: 'Operating Cost',
      value: `€${(operatingCost / 1000).toFixed(0)}k`,
      color: 'text-gray-300',
      icon: '💰'
    },
    {
      label: 'Grid Uptime',
      value: `${gridUptime.toFixed(1)}%`,
      color: gridUptime > 95 ? 'text-green-400' : 'text-yellow-400',
      icon: '⚡'
    },
    {
      label: 'Gas Activations',
      value: gasActivations.toString(),
      color: gasActivations < 5 ? 'text-green-400' : 'text-yellow-400',
      icon: '🏭'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">📊 Performance Summary</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium ${stat.color}`}>
                {stat.label.toUpperCase()}
              </span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Balance Indicator */}
      <div className="mt-4 bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-400">Supply/Demand Balance</span>
          <span className={`text-lg font-bold ${
            balance > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {balance > 0 ? '+' : ''}{balance.toFixed(0)} MW
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              balance > 0 ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{ 
              width: `${Math.min(100, Math.abs(balance) / 5)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};