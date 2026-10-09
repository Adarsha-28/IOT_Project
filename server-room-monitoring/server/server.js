import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import sensorRoutes from './routes/sensorRoutes.js';
import warningRoutes from './routes/warningRoutes.js';
import { SensorData } from './models/SensorData.js';
import { Warning } from './models/Warning.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ServerRoomMonitoring';

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for IoT debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('Connected successfully to MongoDB: ServerRoomMonitoring');
    console.log('Ready and waiting for ESP32 telemetry...');
  })
  .catch((err) => {
    console.warn('MongoDB connection failed or unavailable:', err.message);
    console.warn('Backend will continue operating with in-memory persistence.');
  });

// API Routes
app.use('/api/sensor', sensorRoutes);
app.use('/api/warnings', warningRoutes);

// Root route for IoT project information & health check
app.get('/', (req, res) => {
  res.json({
    project: 'IoT-Based Server Room Temperature Monitoring and Warning System',
    description: 'REST API for ESP32 and React Dashboard',
    systemStatus: 'OPERATIONAL',
    dbStatus: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED (In-Memory Fallback)',
    endpoints: {
      getLatest: 'GET /api/sensor/latest',
      getHistory: 'GET /api/sensor/history?range=1h|6h|24h|7d',
      getWarnings: 'GET /api/warnings',
      postData: 'POST /api/sensor/data'
    }
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server Room Monitoring Backend running on http://localhost:${PORT}`);
  console.log(`Endpoints ready:`);
  console.log(` - GET  http://localhost:${PORT}/api/sensor/latest`);
  console.log(` - GET  http://localhost:${PORT}/api/sensor/history`);
  console.log(` - GET  http://localhost:${PORT}/api/warnings`);
  console.log(` - POST http://localhost:${PORT}/api/sensor/data`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`Tip: Stop the existing process running on port ${PORT} or change PORT in server/.env\n`);
  } else {
    console.error('Server error:', err);
  }
});

