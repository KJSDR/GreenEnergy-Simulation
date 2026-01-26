/**
 * Charts Panel
 * 
 * Real-time charts showing:
 * - Generation vs Demand over time
 * - Battery charge level
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
  demand: { total_demand: number };
  wind: { current_output_mw: number };
  solar: { current_output_mw: number };
  battery: { current_output_mw: number; current_charge_mwh: number };
  gas: { current_output_mw: number };
  total_generation_mw: number;
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
  const maxDataPoints = 50; // Show last 50 data points

  useEffect(() => {
    if (!gridState) return;

    // Add new data point
    const newPoint: DataPoint = {
      time: gridState.weather.time_of_day.toFixed(2),
      demand: gridState.demand.total_demand,
      wind: gridState.wind.current_output_mw,
      solar: gridState.solar.current_output_mw,
      battery: Math.max(0, gridState.battery.current_output_mw), // Only show discharge
      gas: gridState.gas.current_output_mw,
      total: gridState.total_generation_mw,
    };

    setData((prev) => {
      const updated = [...prev, newPoint];
      // Keep only last N points
      if (updated.length > maxDataPoints) {
        return updated.slice(updated.length - maxDataPoints);
      }
      return updated;
    });
  }, [gridState]);

  return (
    <div className="space-y-6">
      {/* Generation vs Demand Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📈 Generation vs Demand</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              label={{ value: 'Time (hour)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={false}
              name="Demand"
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
              name="Total Supply"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Energy Sources Breakdown */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Energy Sources</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              label={{ value: 'Time (hour)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
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