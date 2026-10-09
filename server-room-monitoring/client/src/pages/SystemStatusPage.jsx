import React from 'react';
import ServerRoomEnvironment from '../components/ServerRoomEnvironment';
import DeviceInformation from '../components/DeviceInformation';
import DeviceStatus from '../components/DeviceStatus';
import StatusCard from '../components/StatusCard';
import { Server, Cpu, ShieldCheck, Activity, Wifi, Radio } from 'lucide-react';

export default function SystemStatusPage({
  sensorData,
  statusInfo,
  lastUpdated,
  isOnline,
  isDemo,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System Status & Hardware Health
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed diagnostics for ESP32 microcontroller, DHT11 sensor interface, and network links
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DeviceStatus
          isOnline={isOnline}
          lastUpdated={lastUpdated}
          isDemo={isDemo}
        />
        <StatusCard
          statusInfo={statusInfo}
          temperature={sensorData?.temperature}
        />

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Wi-Fi RSSI
            </span>
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              -58 dBm
            </span>
            <p className="text-xs text-slate-500 mt-0.5">Signal Strength: Excellent</p>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit font-medium">
            SSID: ServerRoom_IoT
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Uptime
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              99.98%
            </span>
            <p className="text-xs text-slate-500 mt-0.5">Continuous Monitoring</p>
          </div>
          <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 w-fit font-medium">
            Zero Dropped Packets
          </span>
        </div>
      </div>

      {/* Section 10: Server Room Environment Matrix */}
      <ServerRoomEnvironment
        sensorData={sensorData}
        statusInfo={statusInfo}
        deviceOnline={isOnline}
      />

      {/* Section 11: Device Information */}
      <DeviceInformation
        statusInfo={statusInfo}
        deviceOnline={isOnline}
        isDemo={isDemo}
      />
    </div>
  );
}
