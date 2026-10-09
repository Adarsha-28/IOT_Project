import React from 'react';
import {
  Activity,
  Thermometer,
  Droplets,
  Cpu,
  Radio,
  Clock,
  Sliders,
  AlertTriangle,
  Flame,
  CheckCircle2,
  WifiOff,
  Volume2,
  VolumeX,
  BellRing,
} from 'lucide-react';

export default function LiveMonitoring({
  sensorData,
  statusInfo,
  lastUpdated,
  pollingInterval,
  setPollingInterval,
  onManualTrigger,
  isDemo,
  onTestSound,
  isAudioMuted,
  onToggleMute,
}) {
  const isAvailable = sensorData?.temperature !== null && sensorData?.temperature !== undefined && !isNaN(parseFloat(sensorData.temperature));
  const temp = isAvailable ? Number(sensorData.temperature).toFixed(1) : '--.-';
  const humidity = sensorData?.humidity !== null && sensorData?.humidity !== undefined && !isNaN(parseFloat(sensorData.humidity))
    ? Number(sensorData.humidity).toFixed(1)
    : '--.-';
  const status = isAvailable ? (statusInfo?.status || 'NORMAL') : 'DISCONNECTED';

  const getStatusColor = () => {
    if (!isAvailable) {
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        text: 'text-slate-600',
        badge: 'bg-slate-500 text-white',
        icon: Radio,
      };
    }
    if (status === 'HIGH TEMPERATURE') {
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-700',
        badge: 'bg-rose-600 text-white',
        icon: Flame,
      };
    }
    if (status === 'WARNING') {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-700',
        badge: 'bg-amber-500 text-white',
        icon: AlertTriangle,
      };
    }
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      badge: 'bg-emerald-600 text-white',
      icon: CheckCircle2,
    };
  };

  const statusTheme = getStatusColor();
  const StatusIcon = statusTheme.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Activity className={`w-5 h-5 ${isAvailable ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Live Server Room Monitoring</h2>
              <span
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isAvailable
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                {isAvailable ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    LIVE FEED
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    AWAITING TELEMETRY
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isAvailable
                ? 'Receiving telemetry from DHT11 sensor via ESP32 Wi-Fi'
                : 'Waiting for ESP32 DevKit V1 to connect and transmit sensor telemetry'}
            </p>
          </div>
        </div>

        {/* Polling Interval Selector & Live Pulse */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Refresh Rate:</span>
            <select
              value={pollingInterval}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="bg-transparent font-semibold text-blue-600 border-none outline-none cursor-pointer text-xs"
            >
              <option value={2000}>2 seconds</option>
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <span>Last Sync:</span>
            <strong className="text-slate-800">{lastUpdated || 'Never'}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Prominent Sensor Gauges */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Box 1: Temperature */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Temperature
              </span>
              <Thermometer className="w-4 h-4 text-blue-600" />
            </div>
            <div className="my-3">
              <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {temp} <span className="text-xl text-slate-500 font-sans">°C</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Sensor: DHT11</p>
            </div>
            <div className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded">
              Rule: &gt;30°C Warn | &gt;35°C High
            </div>
          </div>

          {/* Box 2: Humidity */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Humidity
              </span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div className="my-3">
              <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {humidity} <span className="text-xl text-slate-500 font-sans">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Relative Humidity</p>
            </div>
            <div className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded">
              Ideal: 40% - 60% RH
            </div>
          </div>

          {/* Box 3: Room Status */}
          <div className={`p-4 rounded-xl border ${statusTheme.border} ${statusTheme.bg} flex flex-col justify-between`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Room Status
              </span>
              <StatusIcon className={`w-4 h-4 ${statusTheme.text}`} />
            </div>
            <div className="my-3">
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-extrabold tracking-wider ${statusTheme.badge}`}>
                {status}
              </span>
              <p className="text-xs font-medium text-slate-700 mt-2 line-clamp-2">
                {isAvailable ? statusInfo?.message : 'Waiting for ESP32 telemetry...'}
              </p>
            </div>
            <div className="text-[11px] text-slate-600 bg-white/80 border border-slate-200 px-2 py-1 rounded font-mono">
              Status Threshold Active
            </div>
          </div>

          {/* Box 4: ESP32 Device */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                ESP32
              </span>
              <Cpu className={`w-4 h-4 ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <div className="my-3">
              <div className={`text-2xl font-extrabold tracking-tight ${isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
                {isAvailable ? 'ONLINE' : 'OFFLINE'}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">ESP32 DevKit V1</p>
            </div>
            <div
              className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded font-semibold border ${
                isAvailable
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}
            >
              {isAvailable && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
              {isAvailable ? 'Transmitting Telemetry' : 'Waiting for connection'}
            </div>
          </div>

          {/* Box 5: DHT11 Sensor */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                DHT11
              </span>
              <Radio className={`w-4 h-4 ${isAvailable ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <div className="my-3">
              <div className={`text-2xl font-extrabold tracking-tight ${isAvailable ? 'text-blue-700' : 'text-slate-500'}`}>
                {isAvailable ? 'CONNECTED' : 'WAITING'}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">GPIO Pin 4</p>
            </div>
            <div
              className={`text-[11px] px-2 py-1 rounded font-medium border ${
                isAvailable
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}
            >
              {isAvailable ? 'Data Signal: OK' : 'Awaiting First Signal'}
            </div>
          </div>
        </div>

        {/* Not connected alert message */}
        {!isAvailable && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>No ESP32 connection detected:</strong> Turn on your ESP32 or flash the code in <code>esp32/server_room_esp32.ino</code>. Readings and statuses will appear automatically when data is transmitted.
              </span>
            </div>
          </div>
        )}

        {/* Live Presentation Testing Controls (Viva / Demo Helper) */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Threshold Test Controller (Hardware Simulation)
              </span>
              <p className="text-[11px] text-slate-500">
                Click any button to send test telemetry and verify dashboard reactions & LEDs:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onManualTrigger(27.0, 55.0)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Send Normal (27°C)
            </button>

            <button
              onClick={() => onManualTrigger(32.5, 61.0)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Send Warning (32.5°C)
            </button>

            <button
              onClick={() => onManualTrigger(36.8, 68.0)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Send High Temp (36.8°C)
            </button>

            {onTestSound && (
              <>
                <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block"></div>

                <button
                  onClick={onTestSound}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs transition flex items-center gap-1.5"
                  title="Test alarm buzzer sound in your browser"
                >
                  <BellRing className="w-3.5 h-3.5 text-indigo-600" />
                  Test Alarm Sound
                </button>

                {onToggleMute && (
                  <button
                    onClick={onToggleMute}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs transition flex items-center gap-1.5 ${
                      isAudioMuted
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                    title={isAudioMuted ? 'Alarm sound muted - Click to unmute' : 'Alarm sound enabled - Click to mute'}
                  >
                    {isAudioMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        Muted
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        Audio ON
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
