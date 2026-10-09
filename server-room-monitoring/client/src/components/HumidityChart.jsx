import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import { Droplets } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hum = data.humidity;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700 text-xs">
        <p className="font-semibold text-slate-300 font-mono">{label || data.timeStr}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span>Humidity: <strong className="text-white text-sm font-mono">{hum}% RH</strong></span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {hum >= 40 && hum <= 60 ? 'Optimal Range' : 'Suboptimal Humidity'}
        </p>
      </div>
    );
  }
  return null;
};

export default function HumidityChart({ data = [], onRangeChange, currentRange = '24H' }) {
  const [activeFilter, setActiveFilter] = useState(currentRange);
  const filters = ['1H', '6H', '24H', '7D'];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (onRangeChange) {
      onRangeChange(filter.toLowerCase());
    }
  };

  const chartData = data.map((d) => {
    const dateObj = new Date(d.timestamp);
    const timeFormatted = d.timeStr || dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      ...d,
      displayTime: timeFormatted,
      humidity: Number(parseFloat(d.humidity).toFixed(1)),
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Humidity History
            </h3>
            <p className="text-xs text-slate-500">
              Relative humidity monitoring across time intervals
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterClick(f)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                activeFilter === f
                  ? 'bg-white text-cyan-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-600 py-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-cyan-600 inline-block"></span>
          <span>Relative Humidity (%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2.5 h-2.5 bg-blue-50 border border-blue-200 inline-block rounded-xs"></span>
          <span>Optimal Server Room Band (40% - 60%)</span>
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
              domain={[20, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Target Band Area */}
            <ReferenceArea
              y1={40}
              y2={60}
              fill="#0284c7"
              fillOpacity={0.06}
              strokeOpacity={0}
            />

            <Line
              type="monotone"
              dataKey="humidity"
              name="Humidity"
              stroke="#0891b2"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#0891b2', strokeWidth: 1, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#0e7490', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Unit: Percent Relative Humidity (% RH)</span>
        <span className="font-mono text-slate-400">ASHRAE Standard Reference</span>
      </div>
    </div>
  );
}
