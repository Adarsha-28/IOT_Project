import React from 'react';
import { Droplets } from 'lucide-react';

export default function HumidityCard({ humidity }) {
  const isAvailable = humidity !== null && humidity !== undefined && !isNaN(parseFloat(humidity));
  const humNum = isAvailable ? Number(parseFloat(humidity).toFixed(1)) : null;

  const getHumidityLevel = () => {
    if (!isAvailable) return { label: 'OFFLINE', color: 'text-slate-500', badge: 'bg-slate-100 border-slate-300 text-slate-600' };
    if (humNum < 40) return { label: 'LOW RH', color: 'text-amber-600', badge: 'bg-amber-50 border-amber-200 text-amber-700' };
    if (humNum > 70) return { label: 'HIGH RH', color: 'text-amber-600', badge: 'bg-amber-50 border-amber-200 text-amber-700' };
    return { label: 'OPTIMAL', color: 'text-blue-600', badge: 'bg-blue-50 border-blue-200 text-blue-700' };
  };

  const level = getHumidityLevel();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Humidity
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></span>
              {isAvailable ? 'Live Reading' : 'Awaiting Sensor'}
            </span>
          </div>
        </div>

        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${level.badge}`}>
          {level.label}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {isAvailable ? humNum.toFixed(1) : '--.-'}
          </span>
          <span className="text-lg font-bold text-slate-500">%</span>
        </div>

        <span className="text-xs font-medium text-slate-500">
          {isAvailable ? 'Target: 40% - 60% RH' : 'Waiting for ESP32...'}
        </span>
      </div>

      {/* Progress scale */}
      <div className="mt-3">
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${isAvailable ? Math.min(100, Math.max(0, humNum)) : 0}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
          <span>0%</span>
          <span className="text-blue-600 font-medium">Optimal (40-60%)</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
