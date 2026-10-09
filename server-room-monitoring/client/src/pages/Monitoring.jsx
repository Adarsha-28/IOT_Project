import React from 'react';
import LiveMonitoring from '../components/LiveMonitoring';
import ServerRoomEnvironment from '../components/ServerRoomEnvironment';
import DeviceInformation from '../components/DeviceInformation';
import TemperatureCard from '../components/TemperatureCard';
import HumidityCard from '../components/HumidityCard';
import StatusCard from '../components/StatusCard';
import DeviceStatus from '../components/DeviceStatus';

export default function Monitoring({
  sensorData,
  statusInfo,
  lastUpdated,
  isOnline,
  isDemo,
  pollingInterval,
  setPollingInterval,
  onManualTrigger,
  onTestSound,
  isAudioMuted,
  onToggleMute,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Live Telemetry & Environment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          High-frequency environmental monitoring and hardware status interface
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TemperatureCard
          temperature={sensorData?.temperature}
          statusInfo={statusInfo}
        />
        <HumidityCard
          humidity={sensorData?.humidity}
        />
        <StatusCard
          statusInfo={statusInfo}
          temperature={sensorData?.temperature}
        />
        <DeviceStatus
          isOnline={isOnline}
          lastUpdated={lastUpdated}
          isDemo={isDemo}
        />
      </div>

      {/* Live Monitoring Core */}
      <LiveMonitoring
        sensorData={sensorData}
        statusInfo={statusInfo}
        lastUpdated={lastUpdated}
        pollingInterval={pollingInterval}
        setPollingInterval={setPollingInterval}
        onManualTrigger={onManualTrigger}
        isDemo={isDemo}
        onTestSound={onTestSound}
        isAudioMuted={isAudioMuted}
        onToggleMute={onToggleMute}
      />

      {/* Server Room Status Matrix */}
      <ServerRoomEnvironment
        sensorData={sensorData}
        statusInfo={statusInfo}
        deviceOnline={isOnline}
      />

      {/* Hardware Interface & Pin mapping */}
      <DeviceInformation
        statusInfo={statusInfo}
        deviceOnline={isOnline}
        isDemo={isDemo}
      />
    </div>
  );
}
