import React from 'react';
import { Flame, AlertOctagon, Volume2, VolumeX, BellRing } from 'lucide-react';

export default function CriticalAlertBanner({
  temperature,
  statusInfo,
  isAudioMuted,
  onToggleMute,
  onTestSound,
}) {
  const tempStr = temperature !== null && temperature !== undefined ? `${Number(temperature).toFixed(1)}°C` : 'Critical';

  return (
    <div className="bg-rose-600 text-white px-4 py-3 shadow-md border-b-2 border-rose-800 sticky top-0 z-20 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 animate-bounce">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-rose-950/60 px-2 py-0.5 rounded text-rose-200 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                Critical Alarm Active
              </span>
              <span className="font-extrabold text-sm sm:text-base">
                Server Room Temperature Reached {tempStr}!
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              High temperature threshold (&gt; 35.0°C) breached. ESP32 Red LED is active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute / Unmute Button */}
          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              isAudioMuted
                ? 'bg-rose-900/80 hover:bg-rose-900 text-rose-100 border border-rose-400/30'
                : 'bg-white text-rose-700 hover:bg-rose-50'
            }`}
            title={isAudioMuted ? 'Unmute Alarm Sound' : 'Silence / Mute Alarm Sound'}
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-300" />
                Alarm Silenced (Click to Unmute)
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />
                Silence Alarm Sound
              </>
            )}
          </button>

          {/* Test Sound Button */}
          <button
            onClick={onTestSound}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-800/80 hover:bg-rose-900 text-rose-100 border border-rose-500/40 transition flex items-center gap-1"
            title="Test alarm sound in browser"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test Sound</span>
          </button>
        </div>
      </div>
    </div>
  );
}
