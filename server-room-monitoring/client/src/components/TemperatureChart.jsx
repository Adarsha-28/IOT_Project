import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Thermometer, Calendar, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const temp = data.temperature;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700 text-xs">
        <p className="font-semibold text-slate-300 font-mono">{label || data.timeStr}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <span>Temperature: <strong className="text-white text-sm font-mono">{temp}°C</strong></span>
        </div>
        <div className="mt-1">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
              temp > 35
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : temp > 30
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {temp > 35 ? 'HIGH TEMPERATURE' : temp > 30 ? 'WARNING' : 'NORMAL'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TemperatureChart({ data = [], onRangeChange, currentRange = '24H' }) {
  const [activeFilter, setActiveFilter] = useState(currentRange);

  const filters = ['1H', '6H', '24H', '7D'];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (onRangeChange) {
      onRangeChange(filter.toLowerCase());
    }
  };

  // Format data for display
  const chartData = data.map((d) => {
    const dateObj = new Date(d.timestamp);
    const timeFormatted = d.timeStr || dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      ...d,
      displayTime: timeFormatted,
      temperature: Number(parseFloat(d.temperature).toFixed(1)),
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Temperature History
            </h3>
            <p className="text-xs text-slate-500">
              Continuous thermal trend with safety thresholds
            </p>
          </div>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterClick(f)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                activeFilter === f
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Threshold Legends Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 py-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
          <span>Sensor Reading (°C)</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-700">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500 inline-block"></span>
          <span>Warning Threshold (30.0°C)</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-700">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 inline-block"></span>
          <span>High Temperature Threshold (35.0°C)</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="displayTime"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[20, 45]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${v}°C`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Warning Threshold Reference Line (30°C) */}
            <ReferenceLine
              y={30}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Warning (30°C)',
                position: 'insideTopLeft',
                fill: '#b45309',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* High Temperature Reference Line (35°C) */}
            <ReferenceLine
              y={35}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'High Temp (35°C)',
                position: 'insideTopLeft',
                fill: '#b91c1c',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Actual Temperature Line */}
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#2563eb', strokeWidth: 1, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Unit: Degrees Celsius (°C)</span>
        <span className="font-mono text-slate-400">Fixed Threshold Boundaries</span>
      </div>
    </div>
  );
}
