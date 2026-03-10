/**
 * Charts Panel - COMPACT with both charts
 * 
 * Generation vs Demand + Energy Sources breakdown
 */

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GridState {
  weather: { time_of_day: number };
  demand: { 
    base_load: number;
    industrial_load: number;
    heating_cooling_load: number;
  };
  wind: { current_output_mw: number };
  solar: { current_output_mw: number };
  battery: { current_output_mw: number };
  gas: { current_output_mw: number };
}

interface ChartsPanelProps {
  gridState: GridState;
}

interface DataPoint {
  time: string;
  demand: number;
  wind: number;
  solar: number;
  battery: number;
  gas: number;
  total: number;
}

export const ChartsPanel: React.FC<ChartsPanelProps> = ({ gridState }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const maxDataPoints = 30;

  useEffect(() => {
    if (!gridState) return;

    // Calculate total demand from components
    const totalDemand = (gridState.demand?.base_load || 0) + 
                        (gridState.demand?.industrial_load || 0) + 
                        (gridState.demand?.heating_cooling_load || 0);
    
    // Calculate total generation
    const totalGeneration = (gridState.wind?.current_output_mw || 0) +
                           (gridState.solar?.current_output_mw || 0) +
                           (gridState.battery?.current_output_mw || 0) +
                           (gridState.gas?.current_output_mw || 0);

    const newPoint: DataPoint = {
      time: gridState.weather.time_of_day.toFixed(1),
      demand: totalDemand,
      wind: gridState.wind.current_output_mw,
      solar: gridState.solar.current_output_mw,
      battery: Math.max(0, gridState.battery.current_output_mw),
      gas: gridState.gas.current_output_mw,
      total: totalGeneration,
    };

    setData((prev) => {
      const updated = [...prev, newPoint];
      if (updated.length > maxDataPoints) {
        return updated.slice(updated.length - maxDataPoints);
      }
      console.log('Total data points:', updated.length); // DEBUG
      return updated;
    });
  }, [gridState]);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Generation vs Demand - takes half the space */}
      <div className="flex-1 min-h-0">
        <p className="text-xs text-gray-400 mb-1">Supply vs Demand</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fontSize: 9 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: 9 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '10px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={false}
              name="Demand"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={false}
              name="Total Supply"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Energy Sources Breakdown - takes other half */}
      <div className="flex-1 min-h-0">
        <p className="text-xs text-gray-400 mb-1">Energy Sources</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fontSize: 9 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: 9 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '10px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="wind" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
              name="Wind"
            />
            <Line 
              type="monotone" 
              dataKey="solar" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={false}
              name="Solar"
            />
            <Line 
              type="monotone" 
              dataKey="battery" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
              name="Battery"
            />
            <Line 
              type="monotone" 
              dataKey="gas" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={false}
              name="Gas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};