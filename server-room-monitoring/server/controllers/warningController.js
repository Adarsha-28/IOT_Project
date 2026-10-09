import { Warning } from '../models/Warning.js';
import mongoose from 'mongoose';

// In-memory warnings storage (starts empty, only logs real threshold events)
let inMemoryWarnings = [];


const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * GET /api/warnings
 * Returns list of warning records ordered by latest first
 */
export const getWarnings = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    if (isDbConnected()) {
      const warnings = await Warning.find()
        .sort({ timestamp: -1 })
        .limit(Number(limit));

      if (warnings && warnings.length > 0) {
        return res.json(warnings);
      }
    }

    // Fallback to memory
    return res.json(inMemoryWarnings.slice(0, Number(limit)));
  } catch (error) {
    console.error('Error fetching warnings:', error);
    res.status(500).json({ error: 'Failed to fetch warning history' });
  }
};
