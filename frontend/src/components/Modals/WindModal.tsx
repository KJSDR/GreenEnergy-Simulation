/**
 * Wind Control Modal
 * 
 * Allows user to manually adjust wind speed
 */

import React, { useState } from 'react';
import { Modal } from './Modal';

interface WindModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWindSpeed: number;
  onWindChange: (speed: number) => void;
}

export const WindModal: React.FC<WindModalProps> = ({ 
  isOpen, 
  onClose, 
  currentWindSpeed,
  onWindChange 
}) => {
  const [windSpeed, setWindSpeed] = useState(currentWindSpeed);

  const handleApply = () => {
    onWindChange(windSpeed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌀 Wind Turbine Control">
      <div className="space-y-4">
        
        {/* Current Status */}
        <div className="bg-gray-700 rounded p-4">
          <p className="text-sm text-gray-400">Current Wind Speed</p>
          <p className="text-3xl font-bold">{currentWindSpeed.toFixed(1)} m/s</p>
        </div>

        {/* Wind Speed Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Adjust Wind Speed
          </label>
          <input
            type="range"
            min="0"
            max="30"
            step="0.1"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>0 m/s</span>
            <span className="font-bold text-white">{windSpeed.toFixed(1)} m/s</span>
            <span>30 m/s</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-400 space-y-1">
          <p>• Cut-in: 3 m/s (turbines start)</p>
          <p>• Rated: 12 m/s (maximum power)</p>
          <p>• Cut-out: 25+ m/s (safety shutdown)</p>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Quick Presets:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setWindSpeed(2)}
              className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-sm"
            >
              Calm (2)
            </button>
            <button
              onClick={() => setWindSpeed(8)}
              className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-sm"
            >
              Moderate (8)
            </button>
            <button
              onClick={() => setWindSpeed(15)}
              className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-sm"
            >
              Strong (15)
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </Modal>
  );
};