import axios from 'axios';
import { getTemperatureStatus } from '../utils/temperatureStatus';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Check demo mode: default is FALSE (waits for real ESP32 connection)
const getInitialDemoMode = () => {
  const stored = localStorage.getItem('IOT_DEMO_MODE');
  if (stored !== null) {
    return stored === 'true';
  }
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

let demoModeActive = getInitialDemoMode();

// Internal state for demo simulation (only used when user explicitly enables demo mode)
let currentSimulatedTemp = 32.5;
let currentSimulatedHumidity = 61.0;
let simulatedHistory = [];
let simulatedWarnings = [];

export const isDemoMode = () => demoModeActive;

export const setDemoMode = (enabled) => {
  demoModeActive = !!enabled;
  localStorage.setItem('IOT_DEMO_MODE', String(enabled));
  window.dispatchEvent(new CustomEvent('iot_demo_mode_changed', { detail: demoModeActive }));
};

/**
 * Manually set temperature for viva demo testing
 */
export const setDemoTemperature = (temp, humidity = null) => {
  currentSimulatedTemp = Number(temp);
  if (humidity !== null) {
    currentSimulatedHumidity = Number(humidity);
  }
};

/**
 * Fetch latest sensor data (ESP32 / DHT11)
 */
export const fetchLatestSensorData = async () => {
  // If user explicitly activated demo mode
  if (demoModeActive) {
    const statusInfo = getTemperatureStatus(currentSimulatedTemp);
    const nowIso = new Date().toISOString();

    return {
      connected: true,
      temperature: currentSimulatedTemp,
      humidity: currentSimulatedHumidity,
      status: statusInfo.status,
      message: statusInfo.message,
      timestamp: nowIso,
      ledStatus: statusInfo.ledStatus,
      isDemo: true,
    };
  }

  // Real backend call: fetch real ESP32 telemetry
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/sensor/latest`, { timeout: 4000 });
    return {
      ...response.data,
      isDemo: false,
    };
  } catch (err) {
    console.warn('Backend unavailable or no connection:', err.message);
    return {
      connected: false,
      temperature: null,
      humidity: null,
      status: 'DISCONNECTED',
      message: 'Server Room Backend or ESP32 is not connected.',
      timestamp: null,
      isDemo: false,
      backendError: true,
    };
  }
};

/**
 * Fetch sensor history
 */
export const fetchSensorHistory = async (range = '24h') => {
  if (demoModeActive) {
    return simulatedHistory;
  }

  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/sensor/history`, {
      params: { range },
      timeout: 5000,
    });
    return response.data || [];
  } catch (err) {
    console.warn('Error fetching history from backend:', err.message);
    return [];
  }
};

/**
 * Fetch warning history
 */
export const fetchWarnings = async () => {
  if (demoModeActive) {
    return simulatedWarnings;
  }

  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/warnings`, { timeout: 5000 });
    return response.data || [];
  } catch (err) {
    console.warn('Error fetching warnings from backend:', err.message);
    return [];
  }
};

/**
 * POST sensor data to backend (allows testing real readings)
 */
export const postSensorReading = async (temperature, humidity) => {
  if (demoModeActive) {
    setDemoTemperature(temperature, humidity);
    return { success: true, simulated: true };
  }

  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/sensor/data`, {
      temperature: Number(temperature),
      humidity: Number(humidity),
    });
    return response.data;
  } catch (err) {
    console.error('Error posting sensor reading:', err);
    throw err;
  }
};
