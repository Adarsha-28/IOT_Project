import React from 'react';
import TemperatureCard from '../components/TemperatureCard';
import HumidityCard from '../components/HumidityCard';
import StatusCard from '../components/StatusCard';
import DeviceStatus from '../components/DeviceStatus';
import LiveMonitoring from '../components/LiveMonitoring';
import TemperatureChart from '../components/TemperatureChart';
import HumidityChart from '../components/HumidityChart';
import WarningTable from '../components/WarningTable';
import ServerRoomEnvironment from '../components/ServerRoomEnvironment';
import DeviceInformation from '../components/DeviceInformation';

export default function Dashboard({
  sensorData,
  statusInfo,
  historyData,
  warnings,
  lastUpdated,
  isOnline,
  isDemo,
  pollingInterval,
  setPollingInterval,
  onManualTrigger,
  onRangeChange,
  currentRange,
  onTestSound,
  isAudioMuted,
  onToggleMute,
}) {
  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Server Room Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time temperature and humidity monitoring
        </p>
      </div>

      {/* 4 Main Statistic Cards */}
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

      {/* Large Live Monitoring Section */}
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

      {/* Historical Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart
          data={historyData}
          onRangeChange={onRangeChange}
          currentRange={currentRange}
        />
        <HumidityChart
          data={historyData}
          onRangeChange={onRangeChange}
          currentRange={currentRange}
        />
      </div>

      {/* Server Room Environment Status Matrix */}
      <ServerRoomEnvironment
        sensorData={sensorData}
        statusInfo={statusInfo}
        deviceOnline={isOnline}
      />

      {/* Warning History Section */}
      <WarningTable warnings={warnings} />

      {/* Device Information Section */}
      <DeviceInformation
        statusInfo={statusInfo}
        deviceOnline={isOnline}
        isDemo={isDemo}
      />
    </div>
  );
}
