import express from 'express';
import {
  getLatestReading,
  getSensorHistory,
  postSensorData,
} from '../controllers/sensorController.js';

const router = express.Router();

// GET /api/sensor/latest
router.get('/latest', getLatestReading);

// GET /api/sensor/history
router.get('/history', getSensorHistory);

// POST /api/sensor/data
router.post('/data', postSensorData);

export default router;
