import React from 'react';
import {
  Server,
  Thermometer,
  Droplets,
  Cpu,
  Radio,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  PowerOff,
} from 'lucide-react';

export default function ServerRoomEnvironment({ sensorData, statusInfo, deviceOnline = false }) {
  const isAvailable = deviceOnline && sensorData?.temperature !== null && sensorData?.temperature !== undefined;
  const temp = isAvailable ? Number(sensorData.temperature).toFixed(1) : null;
  const humidity = isAvailable && sensorData?.humidity !== null ? Number(sensorData.humidity).toFixed(1) : null;
  const status = isAvailable ? (statusInfo?.status || 'NORMAL') : 'DISCONNECTED';

  const getStatusBadge = () => {
    if (!isAvailable) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
          OFFLINE
        </span>
      );
    }
    if (status === 'HIGH TEMPERATURE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          HIGH TEMPERATURE
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          WARNING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        NORMAL
      </span>
    );
  };

  const environmentItems = [
    {
      label: 'Temperature',
      value: isAvailable ? `${temp}°C` : '--.-°C',
      icon: Thermometer,
      iconColor: 'text-blue-600 bg-blue-50',
      badge: !isAvailable ? 'Awaiting' : Number(temp) <= 30 ? 'Normal' : Number(temp) <= 35 ? 'Elevated' : 'Critical',
      badgeColor: !isAvailable ? 'text-slate-600 bg-slate-100' : Number(temp) <= 30 ? 'text-emerald-700 bg-emerald-50' : Number(temp) <= 35 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50',
    },
    {
      label: 'Humidity',
      value: isAvailable ? `${humidity}%` : '--.-%',
      icon: Droplets,
      iconColor: 'text-cyan-600 bg-cyan-50',
      badge: isAvailable ? 'Relative Humidity' : 'Awaiting',
      badgeColor: isAvailable ? 'text-blue-700 bg-blue-50' : 'text-slate-600 bg-slate-100',
    },
    {
      label: 'Room Status',
      value: status,
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50',
      customBadge: getStatusBadge(),
    },
    {
      label: 'ESP32',
      value: deviceOnline ? 'ONLINE' : 'OFFLINE',
      icon: Cpu,
      iconColor: deviceOnline ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100',
      badge: deviceOnline ? 'Microcontroller' : 'Disconnected',
      badgeColor: deviceOnline ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100',
    },
    {
      label: 'DHT11',
      value: deviceOnline ? 'CONNECTED' : 'WAITING',
      icon: Radio,
      iconColor: deviceOnline ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 bg-slate-100',
      badge: 'GPIO 4',
      badgeColor: 'text-indigo-700 bg-indigo-50',
    },
    {
      label: 'Wi-Fi',
      value: deviceOnline ? 'CONNECTED' : 'DISCONNECTED',
      icon: Wifi,
      iconColor: deviceOnline ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100',
      badge: '2.4 GHz IoT',
      badgeColor: deviceOnline ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100',
    },
    {
      label: 'System',
      value: deviceOnline ? 'OPERATIONAL' : 'STANDBY',
      icon: ShieldCheck,
      iconColor: 'text-blue-600 bg-blue-50',
      badge: deviceOnline ? 'Monitoring Active' : 'Awaiting Connection',
      badgeColor: deviceOnline ? 'text-blue-700 bg-blue-50' : 'text-amber-700 bg-amber-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Server Room Environment
            </h3>
            <p className="text-xs text-slate-500">
              Complete status matrix of environmental parameters and subsystems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${deviceOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border ${
              deviceOnline
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}
          >
            {deviceOnline ? 'Telemetry Healthy' : 'Awaiting ESP32 Node'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-4">
        {environmentItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:bg-white hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`w-6 h-6 rounded-md ${item.iconColor} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="my-1">
                {item.customBadge ? (
                  item.customBadge
                ) : (
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight font-mono">
                    {item.value}
                  </span>
                )}
              </div>

              {item.badge && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-2 w-fit ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
