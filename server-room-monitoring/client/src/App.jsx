import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CriticalAlertBanner from './components/CriticalAlertBanner';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Warnings from './pages/Warnings';
import Settings from './pages/Settings';
import TemperatureHistoryPage from './pages/TemperatureHistoryPage';
import HumidityHistoryPage from './pages/HumidityHistoryPage';
import SystemStatusPage from './pages/SystemStatusPage';
import { getTemperatureStatus } from './utils/temperatureStatus';
import {
  playCriticalAlarmSound,
  startContinuousAlarm,
  stopContinuousAlarm,
} from './utils/audioAlert';
import {
  fetchLatestSensorData,
  fetchSensorHistory,
  fetchWarnings,
  isDemoMode,
  setDemoMode,
  setDemoTemperature,
  postSensorReading,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    status: 'DISCONNECTED',
    message: 'Waiting for ESP32 connection...',
  });
  const [statusInfo, setStatusInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('Never');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isDemo, setIsDemo] = useState(() => isDemoMode());
  const [pollingInterval, setPollingInterval] = useState(3000);
  const [currentRange, setCurrentRange] = useState('24h');
  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    try {
      return localStorage.getItem('iot_alarm_muted') === 'true';
    } catch {
      return false;
    }
  });

  // Load telemetry data from API or Demo Simulator
  const loadData = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      // 1. Fetch latest reading
      const latest = await fetchLatestSensorData();
      if (latest && latest.connected && latest.temperature !== null && latest.temperature !== undefined) {
        setSensorData(latest);
        const computedStatus = getTemperatureStatus(latest.temperature);
        setStatusInfo({
          ...computedStatus,
          message: latest.message || computedStatus.message,
          ledStatus: latest.ledStatus || computedStatus.ledStatus,
        });
        setIsOnline(true);
        setLastUpdated(
          new Date(latest.timestamp || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      } else {
        // Disconnected or awaiting initial ESP32 telemetry
        setSensorData({
          temperature: null,
          humidity: null,
          status: 'DISCONNECTED',
          message: latest?.message || 'Waiting for ESP32 connection...',
        });
        setStatusInfo(null);
        setIsOnline(false);
      }

      // 2. Fetch history
      const history = await fetchSensorHistory(currentRange);
      if (Array.isArray(history)) {
        setHistoryData(history);
      }

      // 3. Fetch warnings
      const warningList = await fetchWarnings();
      if (Array.isArray(warningList)) {
        setWarnings(warningList);
      }
    } catch (err) {
      console.error('Failed to load sensor telemetry:', err);
      setIsOnline(false);
    } finally {
      if (showSpin) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  }, [currentRange]);

  // Periodic polling interval
  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [loadData, pollingInterval]);

  // Determine if temperature has reached critical level (> 35.0°C)
  const isCritical = Boolean(
    sensorData?.temperature !== null &&
    sensorData?.temperature !== undefined &&
    !isNaN(parseFloat(sensorData.temperature)) &&
    parseFloat(sensorData.temperature) > 35.0
  );

  // Trigger continuous audible alarm when in critical high temperature state
  useEffect(() => {
    if (isCritical && !isAudioMuted) {
      startContinuousAlarm(2200);
    } else {
      stopContinuousAlarm();
    }

    return () => {
      stopContinuousAlarm();
    };
  }, [isCritical, isAudioMuted]);

  // Audio mute toggle handler
  const handleToggleMute = () => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('iot_alarm_muted', String(next));
      } catch {
        // Storage fallback
      }
      if (next) {
        stopContinuousAlarm();
      }
      return next;
    });
  };

  // Test sound buzzer
  const handleTestSound = () => {
    playCriticalAlarmSound(0.4);
  };

  // Handle Demo Mode switch
  const handleToggleDemo = () => {
    const nextState = !isDemo;
    setIsDemo(nextState);
    setDemoMode(nextState);
    loadData(true);
  };

  // Handle manual trigger for viva demonstration
  const handleManualTrigger = async (temp, hum) => {
    try {
      if (isDemo) {
        setDemoTemperature(temp, hum);
      } else {
        await postSensorReading(temp, hum);
      }
      await loadData(true);
    } catch (err) {
      console.warn('Manual trigger error, falling back to local simulation:', err);
      setDemoTemperature(temp, hum);
      await loadData(true);
    }
  };

  const handleRangeChange = (range) => {
    setCurrentRange(range);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceOnline={isOnline}
        isDemo={isDemo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={() => loadData(true)}
          deviceOnline={isOnline}
          isDemo={isDemo}
          onToggleDemo={handleToggleDemo}
          recentWarnings={warnings}
          currentStatus={statusInfo?.status || 'NORMAL'}
          isAudioMuted={isAudioMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Emergency Critical Alarm Banner */}
        {isCritical && (
          <CriticalAlertBanner
            temperature={sensorData?.temperature}
            statusInfo={statusInfo}
            isAudioMuted={isAudioMuted}
            onToggleMute={handleToggleMute}
            onTestSound={handleTestSound}
          />
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              sensorData={sensorData}
              statusInfo={statusInfo}
              historyData={historyData}
              warnings={warnings}
              lastUpdated={lastUpdated}
              isOnline={isOnline}
              isDemo={isDemo}
              pollingInterval={pollingInterval}
              setPollingInterval={setPollingInterval}
              onManualTrigger={handleManualTrigger}
              onRangeChange={handleRangeChange}
              currentRange={currentRange}
              onTestSound={handleTestSound}
              isAudioMuted={isAudioMuted}
              onToggleMute={handleToggleMute}
            />
          )}

          {activeTab === 'live-monitoring' && (
            <Monitoring
              sensorData={sensorData}
              statusInfo={statusInfo}
              lastUpdated={lastUpdated}
              isOnline={isOnline}
              isDemo={isDemo}
              pollingInterval={pollingInterval}
              setPollingInterval={setPollingInterval}
              onManualTrigger={handleManualTrigger}
              onTestSound={handleTestSound}
              isAudioMuted={isAudioMuted}
              onToggleMute={handleToggleMute}
            />
          )}

          {activeTab === 'temp-history' && (
            <TemperatureHistoryPage
              sensorData={sensorData}
              statusInfo={statusInfo}
              historyData={historyData}
              onRangeChange={handleRangeChange}
              currentRange={currentRange}
            />
          )}

          {activeTab === 'humidity-history' && (
            <HumidityHistoryPage
              sensorData={sensorData}
              historyData={historyData}
              onRangeChange={handleRangeChange}
              currentRange={currentRange}
            />
          )}

          {activeTab === 'warnings' && (
            <Warnings
              warnings={warnings}
              statusInfo={statusInfo}
              currentTemp={sensorData?.temperature}
            />
          )}

          {activeTab === 'system-status' && (
            <SystemStatusPage
              sensorData={sensorData}
              statusInfo={statusInfo}
              lastUpdated={lastUpdated}
              isOnline={isOnline}
              isDemo={isDemo}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              pollingInterval={pollingInterval}
              setPollingInterval={setPollingInterval}
              isDemo={isDemo}
              onToggleDemo={handleToggleDemo}
              isAudioMuted={isAudioMuted}
              onToggleMute={handleToggleMute}
            />
          )}
        </main>
      </div>
    </div>
  );
}
