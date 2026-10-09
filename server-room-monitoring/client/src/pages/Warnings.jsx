import React from 'react';
import WarningTable from '../components/WarningTable';
import { AlertTriangle, Flame, CheckCircle2, ShieldAlert, BookOpen, Database } from 'lucide-react';

export default function Warnings({ warnings = [], statusInfo, currentTemp }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Warning Logs & Threshold Specifications
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical log of threshold crossings and defined warning triggers
        </p>
      </div>

      {/* Threshold Rule Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Normal Card */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Rule 1
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-emerald-800 mt-3">
            NORMAL STATE
          </h3>
          <p className="text-xs font-mono font-bold text-slate-700 mt-1">
            Condition: Temperature ≤ 30.0°C
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 mt-3 pt-3 border-t border-emerald-100">
            <li>• Status Label: <strong className="text-emerald-700">NORMAL</strong></li>
            <li>• System Color: <strong className="text-emerald-700">Green</strong></li>
            <li>• Hardware LED: <strong className="text-emerald-700">Green LED ON (GPIO 18)</strong></li>
            <li>• Red LED: <strong className="text-slate-500">OFF</strong></li>
            <li>• Message: <em>"Temperature within normal range"</em></li>
          </ul>
        </div>

        {/* Warning Card */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Rule 2
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-amber-800 mt-3">
            WARNING STATE
          </h3>
          <p className="text-xs font-mono font-bold text-slate-700 mt-1">
            Condition: 30.0°C &lt; Temp ≤ 35.0°C
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 mt-3 pt-3 border-t border-amber-100">
            <li>• Status Label: <strong className="text-amber-700">WARNING</strong></li>
            <li>• System Color: <strong className="text-amber-700">Orange</strong></li>
            <li>• Hardware LED: <strong className="text-rose-700">Red LED ON (GPIO 19)</strong></li>
            <li>• Green LED: <strong className="text-slate-500">OFF</strong></li>
            <li>• Message: <em>"Temperature above normal range"</em></li>
          </ul>
        </div>

        {/* High Temperature Card */}
        <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Rule 3
            </span>
            <Flame className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-base font-bold text-rose-800 mt-3">
            HIGH TEMPERATURE
          </h3>
          <p className="text-xs font-mono font-bold text-slate-700 mt-1">
            Condition: Temperature &gt; 35.0°C
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 mt-3 pt-3 border-t border-rose-100">
            <li>• Status Label: <strong className="text-rose-700">HIGH TEMPERATURE</strong></li>
            <li>• System Color: <strong className="text-rose-700">Red</strong></li>
            <li>• Hardware LED: <strong className="text-rose-700">Red LED ON (GPIO 19)</strong></li>
            <li>• Green LED: <strong className="text-slate-500">OFF</strong></li>
            <li>• Message: <em>"High temperature detected"</em></li>
          </ul>
        </div>
      </div>

      {/* Main Warning Table */}
      <WarningTable warnings={warnings} />

      {/* Storage Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span>MongoDB Storage: Database <strong>ServerRoomMonitoring</strong> &gt; Collection <strong>warnings</strong></span>
        </div>
        <span className="text-slate-400 font-mono">Auto-indexed by timestamp</span>
      </div>
    </div>
  );
}
