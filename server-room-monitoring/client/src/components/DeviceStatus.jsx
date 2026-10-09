import React from 'react';
import { Cpu, Wifi, WifiOff, Clock } from 'lucide-react';

export default function DeviceStatus({ isOnline = false, lastUpdated, isDemo = false }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Device Status
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">ESP32 DevKit V1</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isDemo ? 'ESP32 (Sim)' : isOnline ? 'ESP32 Online' : 'ESP32 Offline'}
          </span>
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isOnline ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Wi-Fi: Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Wi-Fi: Awaiting</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last sync:</span>
        </span>
        <span className="font-mono text-slate-700 font-medium">
          {lastUpdated || 'Never'}
        </span>
      </div>
    </div>
  );
}
