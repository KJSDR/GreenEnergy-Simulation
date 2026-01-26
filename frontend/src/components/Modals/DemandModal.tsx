/**
 * Demand Control Modal
 * 
 * Toggle industrial load on/off
 */

import React, { useState } from 'react';
import { Modal } from './Modal';

interface DemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  industrialEnabled: boolean;
  onIndustrialToggle: (enabled: boolean) => void;
}

export const DemandModal: React.FC<DemandModalProps> = ({ 
  isOpen, 
  onClose, 
  industrialEnabled,
  onIndustrialToggle
}) => {
  const [industrial, setIndustrial] = useState(industrialEnabled);

  const handleApply = () => {
    onIndustrialToggle(industrial);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏙️ City Demand Control">
      <div className="space-y-4">
        
        {/* Current Status */}
        <div className="bg-gray-700 rounded p-4">
          <p className="text-sm text-gray-400">Industrial Load</p>
          <p className="text-2xl font-bold">{industrialEnabled ? 'ACTIVE' : 'INACTIVE'}</p>
          <p className="text-sm text-gray-400 mt-1">+50 MW when active</p>
        </div>

        {/* Industrial Toggle */}
        <div className="bg-gray-700 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Industrial Facilities</p>
              <p className="text-sm text-gray-400">Heavy manufacturing, data centers</p>
            </div>
            <button
              onClick={() => setIndustrial(!industrial)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                industrial ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  industrial ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-400 space-y-1">
          <p>• Base residential load: ~300 MW</p>
          <p>• Industrial adds: +50 MW constant</p>
          <p>• Peak demand occurs at 8am and 6pm</p>
          <p>• Heating/cooling varies with temperature</p>
        </div>

        {/* Impact Warning */}
        {industrial !== industrialEnabled && (
          <div className={`rounded p-3 ${industrial ? 'bg-yellow-900/50' : 'bg-blue-900/50'}`}>
            <p className="text-sm font-medium">
              {industrial ? '⚠️ Increasing demand by 50 MW' : '✅ Reducing demand by 50 MW'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleApply}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
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