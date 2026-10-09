import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  Server,
  Settings,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, deviceOnline = true, isDemo = false }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'temp-history', label: 'Temperature History', icon: Thermometer },
    { id: 'humidity-history', label: 'Humidity History', icon: Droplets },
    { id: 'warnings', label: 'Warnings', icon: AlertTriangle },
    { id: 'system-status', label: 'System Status', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white leading-tight">
              IoT Server Room
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Monitor & Warning
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {item.id === 'warnings' && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Logs
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Mini Widget */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Hardware Controller</span>
            <span className="font-mono text-[11px] text-blue-400 font-semibold">ESP32</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Sensor Interface</span>
            <span className="font-mono text-[11px] text-slate-300">DHT11 (GPIO 4)</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  deviceOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-medium text-slate-300">
                {isDemo ? 'Demo Mode' : deviceOnline ? 'ESP32 Online' : 'ESP32 Offline'}
              </span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>

        <div className="mt-3 text-[10px] text-slate-400 text-center font-mono">
          Threshold Rule: 30°C / 35°C
        </div>
      </div>
    </aside>
  );
}
