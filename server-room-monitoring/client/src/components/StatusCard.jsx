import React from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon, Radio } from 'lucide-react';

export default function StatusCard({ statusInfo, temperature }) {
  const isAvailable = temperature !== null && temperature !== undefined && !isNaN(parseFloat(temperature));
  const status = isAvailable ? (statusInfo?.status || 'NORMAL') : 'DISCONNECTED';
  const message = isAvailable ? (statusInfo?.message || 'Temperature within normal range') : 'Waiting for ESP32 connection...';
  const ledStatus = isAvailable
    ? (statusInfo?.ledStatus || { greenLed: status === 'NORMAL', redLed: status !== 'NORMAL' })
    : { greenLed: false, redLed: false };

  const getStatusConfig = () => {
    switch (status) {
      case 'HIGH TEMPERATURE':
        return {
          title: 'HIGH TEMPERATURE',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          textColor: 'text-rose-700',
          dotColor: 'bg-rose-500',
          icon: AlertOctagon,
          iconBg: 'bg-rose-100 text-rose-600',
        };
      case 'WARNING':
        return {
          title: 'WARNING',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          dotColor: 'bg-amber-500',
          icon: ShieldAlert,
          iconBg: 'bg-amber-100 text-amber-600',
        };
      case 'NORMAL':
        return {
          title: 'NORMAL',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700',
          dotColor: 'bg-emerald-500',
          icon: CheckCircle2,
          iconBg: 'bg-emerald-100 text-emerald-600',
        };
      case 'DISCONNECTED':
      default:
        return {
          title: 'OFFLINE',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-300',
          textColor: 'text-slate-600',
          dotColor: 'bg-slate-400',
          icon: Radio,
          iconBg: 'bg-slate-100 text-slate-500',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`rounded-xl border p-5 shadow-xs transition hover:shadow-md bg-white ${config.borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg ${config.iconBg} flex items-center justify-center`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Room Status
            </h3>
            <span className="text-[11px] text-slate-400">Environment Health</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
        >
          <span className={`w-2 h-2 rounded-full ${config.dotColor} ${isAvailable ? 'animate-pulse' : ''}`} />
          {config.title}
        </span>
      </div>

      <div className="mt-4">
        <h4 className={`text-xl font-bold tracking-tight ${config.textColor}`}>
          {config.title}
        </h4>
        <p className="text-xs font-medium text-slate-600 mt-1">
          {message}
        </p>
      </div>

      {/* Hardware LED Status Feedback */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-mono text-[11px]">Hardware Indicators:</span>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
              ledStatus.greenLed
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${ledStatus.greenLed ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
            GRN LED {ledStatus.greenLed ? 'ON' : 'OFF'}
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
              ledStatus.redLed
                ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${ledStatus.redLed ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`} />
            RED LED {ledStatus.redLed ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
}
