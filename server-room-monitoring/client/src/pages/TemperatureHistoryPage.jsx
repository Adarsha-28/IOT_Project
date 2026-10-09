import React from 'react';
import TemperatureChart from '../components/TemperatureChart';
import TemperatureCard from '../components/TemperatureCard';
import { Thermometer, Layers, Clock, AlertCircle } from 'lucide-react';

export default function TemperatureHistoryPage({
  sensorData,
  statusInfo,
  historyData,
  onRangeChange,
  currentRange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Temperature History & Thermal Analysis
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical thermal trends, threshold breach events, and chronological data points
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TemperatureCard
          temperature={sensorData?.temperature}
          statusInfo={statusInfo}
        />

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Warning Threshold
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">
              30.0 °C
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Crossings trigger Orange Warning status & Red LED
            </p>
          </div>
          <div className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            Rule: Temp &gt; 30.0°C and ≤ 35.0°C
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              High Temperature Threshold
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-rose-600 font-mono">
              35.0 °C
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Crossings trigger Red High Temp status & Red LED
            </p>
          </div>
          <div className="text-[11px] font-mono text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
            Rule: Temp &gt; 35.0°C
          </div>
        </div>
      </div>

      {/* Main Temperature Chart */}
      <TemperatureChart
        data={historyData}
        onRangeChange={onRangeChange}
        currentRange={currentRange}
      />

      {/* Chronological Data Points Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Chronological Temperature Records ({historyData.length})
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
                <th className="py-2.5 px-4">Temperature</th>
                <th className="py-2.5 px-4">Threshold Status</th>
                <th className="py-2.5 px-4">Associated Humidity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {historyData.slice().reverse().map((d, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-600">
                    {d.timeStr || new Date(d.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {Number(d.temperature).toFixed(1)} °C
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === 'HIGH TEMPERATURE'
                          ? 'bg-rose-100 text-rose-800'
                          : d.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    {Number(d.humidity).toFixed(1)} %
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
