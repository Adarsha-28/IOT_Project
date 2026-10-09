import React, { useState } from 'react';
import {
  Bell,
  User,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ToggleLeft,
  ToggleRight,
  Server,
  Layers,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function Header({
  lastUpdated,
  isRefreshing,
  onRefresh,
  deviceOnline = true,
  isDemo = false,
  onToggleDemo,
  recentWarnings = [],
  currentStatus = 'NORMAL',
  isAudioMuted = false,
  onToggleMute,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getStatusBadge = () => {
    if (!deviceOnline || currentStatus === 'DISCONNECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          ESP32 OFFLINE
        </span>
      );
    }
    if (currentStatus === 'HIGH TEMPERATURE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          HIGH TEMP ALERT
        </span>
      );
    }
    if (currentStatus === 'WARNING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          WARNING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        NORMAL
      </span>
    );
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Left: Project Name and Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Server Room Temperature Monitoring
            </h2>
            <span className="hidden sm:inline-block">{getStatusBadge()}</span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            IoT Sensor Node: Node-01 (ESP32 + DHT11)
          </p>
        </div>
      </div>

      {/* Right Controls and Statuses */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Demo Mode Toggle Switch */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-xs font-medium text-slate-600">
            {isDemo ? 'Demo Mode' : 'Live ESP32'}
          </span>
          <button
            onClick={onToggleDemo}
            title={isDemo ? 'Switch to Live Backend' : 'Switch to Demo Simulator'}
            className="text-blue-600 hover:text-blue-700 transition"
          >
            {isDemo ? (
              <ToggleRight className="w-6 h-6 text-blue-600 fill-blue-100" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* ESP32 Connection Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          deviceOnline
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-rose-50 border-rose-200'
        }`}>
          <span className="relative flex h-2.5 w-2.5">
            {deviceOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${deviceOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          <span className={`text-xs font-semibold whitespace-nowrap ${deviceOnline ? 'text-emerald-800' : 'text-rose-800'}`}>
            {isDemo ? 'ESP32 Simulated' : deviceOnline ? 'ESP32 Connected' : 'ESP32 Disconnected'}
          </span>
        </div>

        {/* Last updated and refresh button */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span>Updated: <strong className="text-slate-700">{lastUpdated || 'Just now'}</strong></span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition ${
              isRefreshing ? 'animate-spin text-blue-600' : ''
            }`}
            title="Refresh Readings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Alert Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg relative transition flex items-center justify-center ${
            isAudioMuted
              ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              : 'text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70'
          }`}
          title={isAudioMuted ? 'Sound Alert: Muted (Click to Enable)' : 'Sound Alert: Active (Click to Mute)'}
          aria-label={isAudioMuted ? 'Unmute Sound Alarm' : 'Mute Sound Alarm'}
        >
          {isAudioMuted ? (
            <VolumeX className="w-5 h-5 text-rose-500" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition"
            aria-label="View warnings"
          >
            <Bell className="w-5 h-5" />
            {recentWarnings.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Recent Warning Events ({recentWarnings.length})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Live Feed</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto mt-1">
                {recentWarnings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No active warnings. System running normally.
                  </p>
                ) : (
                  recentWarnings.slice(0, 5).map((w, idx) => (
                    <div key={w._id || idx} className="py-2 text-xs flex items-start gap-2">
                      <span
                        className={`w-2 h-2 mt-1 rounded-full shrink-0 ${
                          w.status === 'HIGH TEMPERATURE'
                            ? 'bg-rose-500'
                            : w.status === 'WARNING'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{w.status}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(w.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{w.message}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {w.temperature}°C • {w.humidity}% RH
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User / Profile Icon */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-medium">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Admin / Operator</p>
            <p className="text-[10px] text-slate-400 font-mono">Server Room 01</p>
          </div>
        </div>
      </div>
    </header>
  );
}
