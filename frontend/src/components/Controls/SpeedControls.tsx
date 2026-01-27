/**
 * Speed Controls
 * 
 * Control simulation playback speed
 */

import React, { useState } from 'react';

export const SpeedControls: React.FC = () => {
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const speeds = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '4x', value: 4 },
    { label: '8x', value: 8 },
  ];

  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed);
    // Note: This will be implemented in backend later
    console.log('Speed changed to:', speed);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    console.log('Pause toggled:', !isPaused);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        
        {/* Pause/Play Button */}
        <button
          onClick={togglePause}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {isPaused ? '▶️ Play' : '⏸️ Pause'}
        </button>

        {/* Speed Buttons */}
        <div className="flex gap-2">
          <span className="text-sm text-gray-400 self-center mr-2">Speed:</span>
          {speeds.map((speed) => (
            <button
              key={speed.value}
              onClick={() => handleSpeedChange(speed.value)}
              className={`py-2 px-3 rounded font-medium transition-colors ${
                currentSpeed === speed.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {speed.label}
            </button>
          ))}
        </div>

      </div>

      {/* Current Status */}
      <div className="mt-3 text-sm text-gray-400">
        {isPaused ? (
          <p>⏸️ Simulation paused</p>
        ) : (
          <p>▶️ Running at {currentSpeed}x speed</p>
        )}
      </div>
    </div>
  );
};