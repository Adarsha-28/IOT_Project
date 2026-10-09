import React from 'react';
import { Thermometer, Radio } from 'lucide-react';

export default function TemperatureCard({ temperature, statusInfo }) {
  const isAvailable = temperature !== null && temperature !== undefined && !isNaN(parseFloat(temperature));
  const tempNum = isAvailable ? Number(parseFloat(temperature).toFixed(1)) : null;

  // Visual status accent
  const getTheme = () => {
    if (!isAvailable) {
      return {
        badgeBg: 'bg-slate-100 border-slate-300 text-slate-600',
        iconBg: 'bg-slate-100 text-slate-500',
        barColor: 'bg-slate-300',
        textColor: 'text-slate-500',
      };
    }
    if (tempNum > 35) {
      return {
        badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
        iconBg: 'bg-rose-100 text-rose-600',
        barColor: 'bg-rose-600',
        textColor: 'text-rose-600',
      };
    }
    if (tempNum > 30) {
      return {
        badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
        iconBg: 'bg-amber-100 text-amber-600',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-600',
      };
    }
    return {
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-600',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    };
  };

  const theme = getTheme();
  const percentage = isAvailable ? Math.min(100, Math.max(0, ((tempNum - 15) / 30) * 100)) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg ${theme.iconBg} flex items-center justify-center`}>
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Temperature
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              {isAvailable ? 'Live Reading' : 'Awaiting Sensor'}
            </span>
          </div>
        </div>

        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
          {!isAvailable ? 'OFFLINE' : tempNum > 35 ? 'HIGH' : tempNum > 30 ? 'ELEVATED' : 'NORMAL'}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {isAvailable ? tempNum.toFixed(1) : '--.-'}
          </span>
          <span className="text-lg font-bold text-slate-500">°C</span>
        </div>

        <span className={`text-xs font-semibold ${theme.textColor}`}>
          {!isAvailable
            ? 'Waiting for ESP32...'
            : `Threshold: ${tempNum <= 30 ? '≤ 30°C' : tempNum <= 35 ? '> 30°C' : '> 35°C'}`}
        </span>
      </div>

      {/* Progress scale */}
      <div className="mt-3">
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${theme.barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
          <span>15°C (Min)</span>
          <span className="text-amber-500 font-semibold">30°C (Warn)</span>
          <span className="text-rose-500 font-semibold">35°C (High)</span>
          <span>45°C (Max)</span>
        </div>
      </div>
    </div>
  );
}
