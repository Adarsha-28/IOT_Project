import { SensorData } from '../models/SensorData.js';
import { Warning } from '../models/Warning.js';
import { getTemperatureStatus } from '../utils/temperatureStatus.js';
import mongoose from 'mongoose';

// In-memory fallback (starts empty, only fills when ESP32 sends telemetry)
let inMemorySensorData = [];
let lastKnownStatus = 'UNKNOWN';

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * GET /api/sensor/latest
 * Returns the most recent temperature and humidity reading
 * If no data has been received yet or if telemetry is stale (>15s), reports disconnected.
 */
export const getLatestReading = async (req, res) => {
  try {
    let latest = null;

    if (isDbConnected()) {
      latest = await SensorData.findOne().sort({ timestamp: -1 });
    } else if (inMemorySensorData.length > 0) {
      latest = inMemorySensorData[inMemorySensorData.length - 1];
    }

    // No data ever received from ESP32 yet
    if (!latest) {
      return res.json({
        connected: false,
        temperature: null,
        humidity: null,
        status: 'DISCONNECTED',
        message: 'Waiting for ESP32 connection...',
        timestamp: null,
        ledStatus: { greenLed: false, redLed: false },
        source: isDbConnected() ? 'database' : 'memory'
      });
    }

    // Check if the reading is fresh (within last 45 seconds)
    const timeSinceLastReadingMs = Date.now() - new Date(latest.timestamp).getTime();
    const isOnline = timeSinceLastReadingMs < 45000;

    const statusInfo = getTemperatureStatus(latest.temperature);

    return res.json({
      connected: isOnline,
      temperature: latest.temperature,
      humidity: latest.humidity,
      status: isOnline ? latest.status : 'OFFLINE',
      message: isOnline
        ? statusInfo.message
        : `ESP32 Disconnected (No data received for ${Math.round(timeSinceLastReadingMs / 1000)}s)`,
      timestamp: latest.timestamp,
      ledStatus: isOnline ? statusInfo.ledStatus : { greenLed: false, redLed: false },
      source: isDbConnected() ? 'database' : 'memory'
    });
  } catch (error) {
    console.error('Error fetching latest sensor reading:', error);
    res.status(500).json({ error: 'Failed to fetch latest sensor reading' });
  }
};

/**
 * GET /api/sensor/history
 * Returns historical sensor readings with optional time range filter (1h, 6h, 24h, 7d)
 */
export const getSensorHistory = async (req, res) => {
  try {
    const { range = '24h', limit = 100 } = req.query;
    
    // Calculate cutoff time
    const now = Date.now();
    let cutoffDate = new Date(now - 24 * 60 * 60 * 1000); // default 24h

    if (range === '1h') {
      cutoffDate = new Date(now - 1 * 60 * 60 * 1000);
    } else if (range === '6h') {
      cutoffDate = new Date(now - 6 * 60 * 60 * 1000);
    } else if (range === '24h') {
      cutoffDate = new Date(now - 24 * 60 * 60 * 1000);
    } else if (range === '7d') {
      cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    if (isDbConnected()) {
      const history = await SensorData.find({
        timestamp: { $gte: cutoffDate }
      })
        .sort({ timestamp: 1 })
        .limit(Number(limit));

      return res.json(history || []);
    }

    // Fallback to in-memory history filtered by range
    const filteredMem = inMemorySensorData.filter(d => new Date(d.timestamp) >= cutoffDate);
    return res.json(filteredMem);
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    res.status(500).json({ error: 'Failed to fetch sensor history' });
  }
};

/**
 * POST /api/sensor/data
 * Receives temperature and humidity from ESP32, applies threshold logic,
 * stores reading in MongoDB and logs warnings when thresholds are crossed.
 */
export const postSensorData = async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters: temperature and humidity are required.'
      });
    }

    const tempNum = Number(parseFloat(temperature).toFixed(1));
    const humNum = Number(parseFloat(humidity).toFixed(1));

    // Determine status using exact predefined logic
    const statusInfo = getTemperatureStatus(tempNum);
    const readingTimestamp = new Date();

    const newReading = {
      temperature: tempNum,
      humidity: humNum,
      status: statusInfo.status,
      timestamp: readingTimestamp,
    };

    // Save to Database if connected
    if (isDbConnected()) {
      await SensorData.create(newReading);

      // Check if status changed or if warning / high temp threshold is met
      if (statusInfo.status !== 'NORMAL' || (lastKnownStatus !== 'NORMAL' && lastKnownStatus !== 'UNKNOWN')) {
        let warningMsg = statusInfo.message;
        if (statusInfo.status === 'NORMAL' && lastKnownStatus !== 'NORMAL') {
          warningMsg = 'Temperature returned to normal';
        }

        await Warning.create({
          temperature: tempNum,
          humidity: humNum,
          status: statusInfo.status,
          message: warningMsg,
          timestamp: readingTimestamp,
        });
      }
    }

    // Maintain in-memory history
    inMemorySensorData.push(newReading);
    if (inMemorySensorData.length > 500) {
      inMemorySensorData.shift();
    }
    lastKnownStatus = statusInfo.status;

    return res.status(201).json({
      success: true,
      temperature: tempNum,
      humidity: humNum,
      status: statusInfo.status,
      message: statusInfo.message,
      timestamp: readingTimestamp.toISOString(),
      ledStatus: statusInfo.ledStatus
    });
  } catch (error) {
    console.error('Error recording sensor data:', error);
    res.status(500).json({ error: 'Failed to record sensor data' });
  }
};
