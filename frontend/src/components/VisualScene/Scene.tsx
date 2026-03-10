/**
 * Visual Scene - Using Image Assets
 * 
 * Clean visual scene with actual images instead of basic SVG
 */

import React, { useState } from 'react';
import { WindModal } from '../Modals/WindModal';
import { SolarModal } from '../Modals/SolarModal';
import { DemandModal } from '../Modals/DemandModal';
import { API_BASE_URL } from '../../config';

interface GridState {
  weather: { 
    wind_speed: number; 
    cloud_cover: number; 
    time_of_day: number;
    temperature: number;
  };
  wind: { current_output_mw: number; capacity_mw: number };
  solar: { current_output_mw: number; capacity_mw: number };
  battery: { 
    current_charge_mwh: number; 
    max_capacity_mwh: number;
    current_output_mw: number;
  };
  gas: { current_output_mw: number };
  demand: { 
    total_demand: number;
    industrial_load: number;
  };
}

interface SceneProps {
  gridState: GridState;
}

export const Scene: React.FC<SceneProps> = ({ gridState }) => {
  const [showWindModal, setShowWindModal] = useState(false);
  const [showSolarModal, setShowSolarModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);

  const windSpeed = gridState.weather.wind_speed;
  const isNight = gridState.weather.time_of_day < 6 || gridState.weather.time_of_day >= 18;
  const solarIntensity = gridState.solar.current_output_mw / gridState.solar.capacity_mw;
  const batteryLevel = (gridState.battery.current_charge_mwh / gridState.battery.max_capacity_mwh) * 100;
  const gasActive = gridState.gas.current_output_mw > 0;

  // Sky gradient based on time
  const getSkyGradient = () => {
    const hour = gridState.weather.time_of_day;
    if (hour < 6 || hour >= 20) return 'from-slate-900 to-slate-800'; // Night
    if (hour < 8) return 'from-orange-400 to-blue-400'; // Dawn
    if (hour < 18) return 'from-blue-400 to-blue-300'; // Day
    return 'from-orange-400 to-purple-500'; // Dusk
  };

  // API calls
  const handleWindChange = (speed: number) => {
    fetch(`${API_BASE_URL}/api/control/wind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wind_speed: speed })
    });
  };

  const handleCloudChange = (cover: number) => {
    fetch(`${API_BASE_URL}/api/control/clouds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cloud_cover: cover })
    });
  };

  const handleTemperatureChange = (temp: number) => {
    fetch(`${API_BASE_URL}/api/control/temperature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature: temp })
    });
  };

  const handleIndustrialToggle = (enabled: boolean) => {
    fetch(`${API_BASE_URL}/api/control/industrial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* Sky Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getSkyGradient()} transition-all duration-1000`} />
      
      {/* Clouds - Drifting */}
      <div className="absolute top-10 left-0 w-full h-32 pointer-events-none">
        <img 
          src="/assets/images/cloud.png" 
          alt="cloud"
          className="absolute animate-drift"
          style={{ 
            width: '120px',
            opacity: gridState.weather.cloud_cover,
            top: '20px',
            left: '10%'
          }}
        />
        <img 
          src="/assets/images/cloud.png" 
          alt="cloud"
          className="absolute animate-drift-slow"
          style={{ 
            width: '140px',
            opacity: gridState.weather.cloud_cover,
            top: '50px',
            left: '40%'
          }}
        />
        <img 
          src="/assets/images/cloud.png" 
          alt="cloud"
          className="absolute animate-drift"
          style={{ 
            width: '100px',
            opacity: gridState.weather.cloud_cover,
            top: '30px',
            left: '70%'
          }}
        />
      </div>

      {/* Ground Layer */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-b from-green-900 to-green-950" />

      {/* Elements positioned on screen */}
      <div className="absolute inset-0 flex items-end justify-around pb-28 px-8">
        
        {/* Wind Turbine - Left (tower + spinning blades) */}
        <div 
          className="cursor-pointer hover:scale-105 transition-transform relative"
          onClick={() => setShowWindModal(true)}
          style={{ height: '280px', width: '200px' }}
        >
          {/* Spinning Blades - BEHIND tower */}
          <img 
            src="/assets/images/blade.png" 
            alt="wind turbine blades"
            className="absolute w-auto object-contain"
            style={{ 
              height: '180px',
              top: '-82px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              opacity: windSpeed > 3 && windSpeed < 25 ? 1 : 0.5,
              animation: windSpeed > 3 && windSpeed < 25 ? `spin ${10 / (windSpeed / 5)}s linear infinite` : 'none'
            }}
          />
          {/* Static Tower - IN FRONT of blades */}
          <img 
            src="/assets/images/tower.png" 
            alt="wind turbine tower"
            className="h-full w-auto object-contain absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ zIndex: 2 }}
          />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 px-3 py-1 rounded text-xs">
            💨 {windSpeed.toFixed(1)} m/s
          </div>
        </div>

        {/* Solar Panels - Center-Left */}
        <div 
          className="cursor-pointer hover:scale-105 transition-transform relative"
          onClick={() => setShowSolarModal(true)}
          style={{ height: '120px' }}
        >
          <img 
            src="/assets/images/solar-panels.png" 
            alt="solar panels"
            className="h-full w-auto object-contain"
            style={{ 
              filter: `brightness(${0.7 + solarIntensity * 0.5}) drop-shadow(0 0 ${solarIntensity * 20}px rgba(250, 204, 21, ${solarIntensity}))`
            }}
          />
        </div>

        {/* Village - Center */}
        <div 
          className="cursor-pointer hover:scale-105 transition-transform relative"
          onClick={() => setShowDemandModal(true)}
          style={{ height: '150px' }}
        >
          <img 
            src="/assets/images/village.gif" 
            alt="village"
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Factory - Right */}
        <div 
          className="relative"
          style={{ height: '180px' }}
        >
          <img 
            src="/assets/images/factory.png" 
            alt="factory"
            className="h-full w-auto object-contain"
            style={{ 
              filter: gasActive ? 'brightness(1.2)' : 'brightness(0.7) grayscale(0.5)'
            }}
          />
          {gasActive && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl animate-pulse">
              💨
            </div>
          )}
        </div>

      </div>

      {/* Battery Indicator - Bottom Right */}
      <div className="absolute bottom-8 right-8 bg-gray-800 bg-opacity-90 rounded-lg p-4 border border-gray-700">
        <p className="text-xs text-gray-400 mb-1">Battery</p>
        <div className="w-24 h-8 bg-gray-700 rounded relative overflow-hidden">
          <div 
            className={`h-full transition-all ${batteryLevel > 20 ? 'bg-green-400' : 'bg-red-400'}`}
            style={{ width: `${batteryLevel}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {batteryLevel.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Info Overlay - Bottom Left */}
      <div className="absolute bottom-8 left-8 bg-gray-800 bg-opacity-90 p-4 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-300">⏰ {gridState.weather.time_of_day.toFixed(2)}:00</p>
        <p className="text-xs text-gray-500 mt-1">Click elements to control</p>
      </div>

      {/* Modals */}
      <WindModal
        isOpen={showWindModal}
        onClose={() => setShowWindModal(false)}
        currentWindSpeed={gridState.weather.wind_speed}
        onWindChange={handleWindChange}
      />

      <SolarModal
        isOpen={showSolarModal}
        onClose={() => setShowSolarModal(false)}
        currentCloudCover={gridState.weather.cloud_cover}
        currentTemperature={gridState.weather.temperature}
        onCloudChange={handleCloudChange}
        onTemperatureChange={handleTemperatureChange}
      />

      <DemandModal
        isOpen={showDemandModal}
        onClose={() => setShowDemandModal(false)}
        industrialEnabled={gridState.demand.industrial_load > 0}
        onIndustrialToggle={handleIndustrialToggle}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes drift-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes spin {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        
        .animate-drift {
          animation: drift 60s linear infinite;
        }
        
        .animate-drift-slow {
          animation: drift-slow 90s linear infinite;
        }
      `}</style>
    </div>
  );
};