/**
 * Solar/Weather Control Modal
 * 
 * Controls cloud cover and temperature (affects solar output)
 */

import React, { useState } from 'react';
import { Modal } from './Modal';

interface SolarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCloudCover: number;
  currentTemperature: number;
  onCloudChange: (cover: number) => void;
  onTemperatureChange: (temp: number) => void;
}

export const SolarModal: React.FC<SolarModalProps> = ({ 
  isOpen, 
  onClose, 
  currentCloudCover,
  currentTemperature,
  onCloudChange,
  onTemperatureChange
}) => {
  const [cloudCover, setCloudCover] = useState(currentCloudCover);
  const [temperature, setTemperature] = useState(currentTemperature);

  const handleApply = () => {
    onCloudChange(cloudCover);
    onTemperatureChange(temperature);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="☀️ Solar & Weather Control">
      <div className="space-y-4">
        
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm text-gray-400">Cloud Cover</p>
            <p className="text-2xl font-bold">{(currentCloudCover * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm text-gray-400">Temperature</p>
            <p className="text-2xl font-bold">{currentTemperature.toFixed(1)}°C</p>
          </div>
        </div>

        {/* Cloud Cover Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cloud Cover
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={cloudCover}
            onChange={(e) => setCloudCover(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>Clear</span>
            <span className="font-bold text-white">{(cloudCover * 100).toFixed(0)}%</span>
            <span>Overcast</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Temperature
          </label>
          <input
            type="range"
            min="-10"
            max="35"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>-10°C</span>
            <span className="font-bold text-white">{temperature.toFixed(1)}°C</span>
            <span>35°C</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-400 space-y-1">
          <p>• Clouds reduce solar output by up to 80%</p>
          <p>• Cold temps (&lt;10°C) increase heating demand</p>
          <p>• Hot temps (&gt;20°C) increase cooling demand</p>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Quick Presets:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setCloudCover(0);
                setTemperature(25);
              }}
              className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-sm"
            >
              ☀️ Sunny
            </button>
            <button
              onClick={() => {
                setCloudCover(0.5);
                setTemperature(15);
              }}
              className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-sm"
            >
              ⛅ Partly Cloudy
            </button>
            <button
              onClick={() => {
                setCloudCover(0.9);
                setTemperature(8);
              }}
              className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-sm"
            >
              ☁️ Overcast
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleApply}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded"
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