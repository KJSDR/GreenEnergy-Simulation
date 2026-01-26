/**
 * Visual Scene
 * 
 * Animated SVG scene showing:
 * - Wind turbines (spinning based on wind speed)
 * - Solar panels (glowing based on output)
 * - City (lights based on demand)
 * - Battery indicator
 * - Gas plant
 * - Sky (changes with time of day)
 */

import React, { useState } from 'react';
import { WindModal } from '../Modals/WindModal';

interface GridState {
  weather: { 
    wind_speed: number; 
    cloud_cover: number; 
    time_of_day: number;
  };
  wind: { current_output_mw: number; capacity_mw: number };
  solar: { current_output_mw: number; capacity_mw: number };
  battery: { 
    current_charge_mwh: number; 
    max_capacity_mwh: number;
    current_output_mw: number;
  };
  gas: { current_output_mw: number };
  demand: { total_demand: number };
}

interface SceneProps {
  gridState: GridState;
}

export const Scene: React.FC<SceneProps> = ({ gridState }) => {
  const [showWindModal, setShowWindModal] = useState(false);

  // Calculate animation speeds and intensities
  const windSpeed = gridState.weather.wind_speed;
  const isNight = gridState.weather.time_of_day < 6 || gridState.weather.time_of_day >= 18;
  
  // Turbine rotation speed (0 = stopped, 1 = slow, 3 = fast)
  const turbineSpeed = windSpeed < 3 ? 0 : windSpeed > 25 ? 0 : windSpeed / 5;
  
  // Solar glow intensity
  const solarIntensity = gridState.solar.current_output_mw / gridState.solar.capacity_mw;
  
  // Battery charge level
  const batteryLevel = (gridState.battery.current_charge_mwh / gridState.battery.max_capacity_mwh) * 100;
  
  // Gas plant active
  const gasActive = gridState.gas.current_output_mw > 0;
  
  // Sky color based on time
  const getSkyColor = () => {
    const hour = gridState.weather.time_of_day;
    if (hour < 6 || hour >= 20) return '#1a1a2e'; // Night
    if (hour < 8) return '#ff6b6b'; // Dawn
    if (hour < 18) return '#4ecdc4'; // Day
    return '#ff6b6b'; // Dusk
  };

  const handleWindChange = (speed: number) => {
    fetch('http://localhost:8000/api/control/wind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wind_speed: speed })
    });
  };

  return (
    <div className="h-full bg-gray-900 relative overflow-hidden">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1000 800"
        className="w-full h-full"
      >
        {/* Sky */}
        <rect 
          width="1000" 
          height="600" 
          fill={getSkyColor()}
          className="transition-all duration-1000"
        />
        
        {/* Sun/Moon */}
        <circle 
          cx={isNight ? 900 : 100} 
          cy={100}
          r={40}
          fill={isNight ? '#f0f0f0' : '#ffd700'}
          className="transition-all duration-1000"
        />
        
        {/* Clouds */}
        <ellipse 
          cx={200 + (gridState.weather.time_of_day * 10)} 
          cy={150} 
          rx={80} 
          ry={30}
          fill="rgba(255,255,255,0.3)"
          opacity={gridState.weather.cloud_cover}
        />
        <ellipse 
          cx={600 + (gridState.weather.time_of_day * 5)} 
          cy={120} 
          rx={100} 
          ry={35}
          fill="rgba(255,255,255,0.3)"
          opacity={gridState.weather.cloud_cover}
        />
        
        {/* Ground */}
        <rect 
          y="600" 
          width="1000" 
          height="200" 
          fill="#2d5016"
        />
        
        {/* Wind Turbines - CLICKABLE */}
        {[200, 350, 500].map((x, i) => (
          <g 
            key={i} 
            onClick={() => setShowWindModal(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            {/* Tower */}
            <line 
              x1={x} 
              y1={400} 
              x2={x} 
              y2={600} 
              stroke="#e0e0e0" 
              strokeWidth="8"
            />
            {/* Blades */}
            <g 
              transform={`translate(${x}, 400)`}
              style={{
                animation: turbineSpeed > 0 ? `spin ${10 / turbineSpeed}s linear infinite` : 'none'
              }}
            >
              <line x1="0" y1="0" x2="0" y2="-80" stroke="#f0f0f0" strokeWidth="8" />
              <line x1="0" y1="0" x2="-70" y2="40" stroke="#f0f0f0" strokeWidth="8" />
              <line x1="0" y1="0" x2="70" y2="40" stroke="#f0f0f0" strokeWidth="8" />
              <circle cx="0" cy="0" r="15" fill="#333" />
            </g>
            {/* Status indicator */}
            <circle 
              cx={x} 
              cy={620} 
              r="8" 
              fill={turbineSpeed > 0 ? "#10b981" : "#ef4444"}
            />
          </g>
        ))}
        
        {/* Solar Array */}
        <g transform="translate(650, 500)">
          <rect 
            width="150" 
            height="80" 
            fill="#1e40af"
            opacity={0.8 + (solarIntensity * 0.2)}
          />
          <rect 
            width="150" 
            height="80" 
            fill="rgba(255, 215, 0, 0.3)"
            style={{
              filter: `drop-shadow(0 0 ${solarIntensity * 20}px rgba(255, 215, 0, ${solarIntensity}))`
            }}
          />
          {/* Grid lines */}
          <line x1="50" y1="0" x2="50" y2="80" stroke="#0f172a" strokeWidth="2" />
          <line x1="100" y1="0" x2="100" y2="80" stroke="#0f172a" strokeWidth="2" />
          <line x1="0" y1="40" x2="150" y2="40" stroke="#0f172a" strokeWidth="2" />
        </g>
        
        {/* City */}
        <g transform="translate(50, 480)">
          {[0, 40, 80].map((x, i) => (
            <rect 
              key={i}
              x={x} 
              y={0}
              width="30" 
              height={80 + (i * 20)}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1"
            />
          ))}
          {/* Windows (lights) */}
          {[0, 40, 80].map((x, i) => (
            <g key={`windows-${i}`}>
              {[10, 30, 50].map((y, j) => (
                <rect 
                  key={j}
                  x={x + 8} 
                  y={y + (i * 20)}
                  width="6" 
                  height="8"
                  fill={isNight ? "#fbbf24" : "rgba(251, 191, 36, 0.3)"}
                  opacity={0.5 + (gridState.demand.total_demand / 1000)}
                />
              ))}
            </g>
          ))}
        </g>
        
        {/* Battery */}
        <g transform="translate(850, 520)">
          <rect 
            width="80" 
            height="60" 
            fill="none"
            stroke="#10b981" 
            strokeWidth="3"
            rx="5"
          />
          <rect 
            x="5" 
            y={60 - (batteryLevel * 0.5)}
            width="70" 
            height={batteryLevel * 0.5}
            fill={batteryLevel > 20 ? "#10b981" : "#ef4444"}
            opacity="0.7"
          />
          <rect 
            x="30" 
            y="-8" 
            width="20" 
            height="8"
            fill="#10b981"
            rx="2"
          />
          <text 
            x="40" 
            y="40" 
            textAnchor="middle" 
            fill="white" 
            fontSize="14"
            fontWeight="bold"
          >
            {batteryLevel.toFixed(0)}%
          </text>
        </g>
        
        {/* Gas Plant */}
        <g transform="translate(750, 520)">
          <rect 
            width="60" 
            height="80" 
            fill="#4b5563"
            stroke="#1f2937"
            strokeWidth="2"
          />
          {/* Smoke stack */}
          <rect 
            x="20" 
            y="-40" 
            width="20" 
            height="40"
            fill="#6b7280"
          />
          {/* Smoke (when active) */}
          {gasActive && (
            <>
              <circle cx="30" cy="-50" r="10" fill="rgba(156, 163, 175, 0.5)" />
              <circle cx="25" cy="-65" r="12" fill="rgba(156, 163, 175, 0.4)" />
              <circle cx="35" cy="-75" r="10" fill="rgba(156, 163, 175, 0.3)" />
            </>
          )}
          {/* Status indicator */}
          <circle 
            cx="30" 
            cy="40" 
            r="8" 
            fill={gasActive ? "#ef4444" : "#6b7280"}
          />
        </g>
        
      </svg>
      
      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-300">💨 Wind: {windSpeed.toFixed(1)} m/s</p>
        <p className="text-sm text-gray-300">⏰ Time: {gridState.weather.time_of_day.toFixed(2)}:00</p>
        <p className="text-xs text-gray-500 mt-2">👆 Click turbines to control</p>
      </div>
      
      {/* Wind Control Modal */}
      <WindModal
        isOpen={showWindModal}
        onClose={() => setShowWindModal(false)}
        currentWindSpeed={gridState.weather.wind_speed}
        onWindChange={handleWindChange}
      />
      
      {/* Add CSS for turbine animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};