import React from 'react';
import HumidityChart from '../components/HumidityChart';
import HumidityCard from '../components/HumidityCard';
import { Droplets, Clock, ShieldCheck } from 'lucide-react';

export default function HumidityHistoryPage({
  sensorData,
  historyData,
  onRangeChange,
  currentRange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Humidity History & Environmental Moisture
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical relative humidity tracking and server room moisture limits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HumidityCard
          humidity={sensorData?.humidity}
        />

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Optimal Humidity Band
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-blue-600 font-mono">
              40% - 60%
            </span>
            <p className="text-xs text-slate-500 mt-1">
              ASHRAE standard range to prevent electrostatic discharge & condensation
            </p>
          </div>
          <div className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
            Target RH for electronics
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sensor Accuracy
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-cyan-700 font-mono">
              ± 5% RH
            </span>
            <p className="text-xs text-slate-500 mt-1">
              DHT11 sensor operating range: 20% to 90% RH
            </p>
          </div>
          <div className="text-[11px] font-mono text-cyan-800 bg-cyan-50 px-2 py-1 rounded border border-cyan-200">
            Sampling period: ~1 Hz
          </div>
        </div>
      </div>

      {/* Main Humidity Chart */}
      <HumidityChart
        data={historyData}
        onRangeChange={onRangeChange}
        currentRange={currentRange}
      />

      {/* Chronological Humidity Records */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Chronological Humidity Records ({historyData.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Source: collection sensor_data
          </span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Humidity (% RH)</th>
                <th className="py-2.5 px-4">Thermal Reading</th>
                <th className="py-2.5 px-4">Status Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {historyData.slice().reverse().map((d, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-600">
                    {d.timeStr || new Date(d.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-cyan-700">
                    {Number(d.humidity).toFixed(1)} %
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    {Number(d.temperature).toFixed(1)} °C
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {d.humidity >= 40 && d.humidity <= 60 ? 'Optimal' : 'Acceptable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
