import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Volume2,
  VolumeX,
  BellRing,
} from 'lucide-react';
import { playCriticalAlarmSound, playWarningChime } from '../utils/audioAlert';

export default function Settings({
  pollingInterval,
  setPollingInterval,
  isDemo,
  onToggleDemo,
  isAudioMuted = false,
  onToggleMute,
}) {
  const [savedNotice, setSavedNotice] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System Configuration & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Telemetry polling intervals, network endpoints, hardware pin assignments, and system rules
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      {/* Grid of settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Polling & Demo Mode */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Telemetry & Polling Configuration
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sensor Data Refresh Rate
            </label>
            <select
              value={pollingInterval}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
              <option value={2000}>2 Seconds (High frequency)</option>
              <option value={3000}>3 Seconds (Standard recommendation)</option>
              <option value={5000}>5 Seconds (Low network utilization)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Specifies the interval between consecutive GET /api/sensor/latest requests.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">Demo Simulation Mode</div>
              <p className="text-[11px] text-slate-400">
                Run without hardware or live backend for presentations
              </p>
            </div>
            <button
              onClick={onToggleDemo}
              className="text-blue-600 hover:text-blue-700 transition"
            >
              {isDemo ? (
                <ToggleRight className="w-7 h-7 text-blue-600 fill-blue-100" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-400" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Backend REST API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full text-xs p-2 font-mono rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Base URL used by Axios client to communicate with the Express server.
            </p>
          </div>
        </div>

        {/* Temperature Thresholds (Fixed Predefined Rules) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Predefined Temperature Threshold Rules
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs">
              <div className="font-bold text-emerald-800">Normal Range (≤ 30.0°C)</div>
              <div className="text-slate-600 mt-0.5">Green status, Green LED ON, Red LED OFF.</div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
              <div className="font-bold text-amber-800">Warning Range (&gt; 30.0°C and ≤ 35.0°C)</div>
              <div className="text-slate-600 mt-0.5">Orange status, Red LED ON, Green LED OFF.</div>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-xs">
              <div className="font-bold text-rose-800">High Temperature Range (&gt; 35.0°C)</div>
              <div className="text-slate-600 mt-0.5">Red status, Red LED ON, Green LED OFF.</div>
            </div>
          </div>
        </div>

        {/* Database & Collections */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Database Specifications
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">Database Engine:</span>
              <strong className="text-slate-800">MongoDB 8.0.x</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">Database Name:</span>
              <strong className="text-blue-600">ServerRoomMonitoring</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">Sensor Collection:</span>
              <strong className="text-slate-800">sensor_data</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">Warnings Collection:</span>
              <strong className="text-slate-800">warnings</strong>
            </div>
          </div>
        </div>

        {/* ESP32 Hardware Pin Assignments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              ESP32 Pinout Configuration
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">DHT11 Data Pin:</span>
              <strong className="text-indigo-600">GPIO 4</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">Green Status LED:</span>
              <strong className="text-emerald-600">GPIO 18</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">Red Warning LED:</span>
              <strong className="text-rose-600">GPIO 19</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-sans">DHT11 Power Supply:</span>
              <strong className="text-slate-800">3.3V / GND</strong>
            </div>
          </div>
        </div>

        {/* Audio Alarm Sound Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Volume2 className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Acoustic Alarm & Critical Sound Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Audible Critical Alert</div>
                  <p className="text-[11px] text-slate-500">
                    Sounds repeated acoustic alarm buzzer when temperature &gt; 35.0°C
                  </p>
                </div>
                <button
                  onClick={onToggleMute}
                  className="text-blue-600 hover:text-blue-700 transition"
                  title={isAudioMuted ? 'Click to Enable Sound' : 'Click to Mute Sound'}
                >
                  {isAudioMuted ? (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  ) : (
                    <ToggleRight className="w-8 h-8 text-rose-600 fill-rose-100" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold">
                <span className="text-slate-500">Status:</span>
                {isAudioMuted ? (
                  <span className="text-rose-600 flex items-center gap-1">
                    <VolumeX className="w-3.5 h-3.5" /> Muted / Disabled
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Enabled (Urgent Buzzer Active)
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">Audio Synthesis Engine</div>
              <p className="text-[11px] text-slate-500">
                Uses HTML5 Web Audio API to generate high-urgency multi-frequency alarm beeps natively in the browser without external media assets.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => playCriticalAlarmSound()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-xs"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  Test Critical Alarm (880Hz-660Hz)
                </button>
                <button
                  type="button"
                  onClick={() => playWarningChime()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1.5 shadow-xs"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  Test Warning Chime
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance / Project Purpose Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-950">
            Project Scope: IoT-Based Server Room Temperature Monitoring and Warning System
          </h4>
          <p className="text-blue-800 mt-1 leading-relaxed">
            This system is strictly a threshold-based monitoring and warning solution. It reads continuous telemetry from the ESP32 DHT11 sensor node, determines current status according to deterministic rules, controls physical status LEDs, and records alerts in MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}
