import React from 'react';
import {
  Cpu,
  Radio,
  Wifi,
  Zap,
  CheckCircle,
  Lightbulb,
  Layers,
  Terminal,
  Server,
} from 'lucide-react';

export default function DeviceInformation({ statusInfo, deviceOnline = true, isDemo = false }) {
  const ledStatus = statusInfo?.ledStatus || { greenLed: true, redLed: false };

  const specs = [
    { label: 'Device', value: 'ESP32 DevKit V1', detail: 'Tensilica Xtensa Dual-Core 32-bit LX6' },
    { label: 'Sensor', value: 'DHT11', detail: 'Capacitive humidity & NTC thermistor' },
    { label: 'Sensor Type', value: 'Temperature + Humidity', detail: 'Calibrated digital signal output' },
    { label: 'Connection', value: 'Wi-Fi (802.11 b/g/n)', detail: 'WPA2 Personal • Station Mode' },
    { label: 'DHT11 Data Pin', value: 'GPIO 4', detail: 'Digital input with 10k pull-up' },
    { label: 'Green LED', value: 'GPIO 18', detail: 'Active when Temp ≤ 30°C (Normal)' },
    { label: 'Red LED', value: 'GPIO 19', detail: 'Active when Temp > 30°C (Warning/High)' },
    { label: 'Device Status', value: isDemo ? 'SIMULATED (DEMO)' : deviceOnline ? 'ONLINE' : 'OFFLINE', detail: 'REST API Telemetry Polling' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Device Information & Hardware Interface
            </h3>
            <p className="text-xs text-slate-500">
              Hardware node configuration, GPIO pin mapping, and telemetry metadata
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
            Node ID: ESP32-SR-01
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Firmware v1.0.4
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {specs.map((spec, i) => (
          <div
            key={i}
            className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {spec.label}
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono mt-1">
              {spec.value}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {spec.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Hardware LED Circuit Simulation Diagram */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-200">
              Hardware Status LED Real-time Circuit State
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Directly mirrors physical GPIO output
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          {/* Green LED indicator */}
          <div
            className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
              ledStatus.greenLed
                ? 'bg-emerald-950/70 border-emerald-500/80 shadow-md shadow-emerald-900/30'
                : 'bg-slate-950 border-slate-800 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  ledStatus.greenLed
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Green Status LED (GPIO 18)
                </div>
                <div className="text-[11px] text-slate-400">
                  Normal Temperature (≤ 30.0°C)
                </div>
              </div>
            </div>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                ledStatus.greenLed
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {ledStatus.greenLed ? 'ACTIVE / ON' : 'OFF'}
            </span>
          </div>

          {/* Red LED indicator */}
          <div
            className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
              ledStatus.redLed
                ? 'bg-rose-950/70 border-rose-500/80 shadow-md shadow-rose-900/30'
                : 'bg-slate-950 border-slate-800 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  ledStatus.redLed
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Red Warning LED (GPIO 19)
                </div>
                <div className="text-[11px] text-slate-400">
                  Threshold Exceeded (&gt; 30.0°C)
                </div>
              </div>
            </div>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                ledStatus.redLed
                  ? 'bg-rose-500 text-white font-black'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {ledStatus.redLed ? 'ACTIVE / ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
