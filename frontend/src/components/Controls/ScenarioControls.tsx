/**
 * Scenario Controls
 * 
 * Quick buttons to trigger preset scenarios
 */

import React from 'react';

export const ScenarioControls: React.FC = () => {
  
  const triggerScenario = async (scenario: string) => {
    try {
      await fetch(`http://localhost:8000/api/scenario/${scenario}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to trigger scenario:', error);
    }
  };

  const resetSimulation = async () => {
    try {
      await fetch('http://localhost:8000/api/reset', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to reset:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">🎮 Scenario Controls</h2>
      
      <div className="space-y-3">
        <button
          onClick={() => triggerScenario('storm')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded transition-colors"
        >
          ⛈️ Storm (High Wind + Clouds)
        </button>

        <button
          onClick={() => triggerScenario('calm')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors"
        >
          🌤️ Calm Weather (Low Wind)
        </button>

        <button
          onClick={resetSimulation}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded transition-colors"
        >
          🔄 Reset Simulation
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        <p>• Storm: Tests grid under extreme wind (turbine shutdowns)</p>
        <p>• Calm: Tests battery + gas backup capacity</p>
      </div>
    </div>
  );
};