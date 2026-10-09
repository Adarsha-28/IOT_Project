import express from 'express';
import { getWarnings } from '../controllers/warningController.js';

const router = express.Router();

// GET /api/warnings
router.get('/', getWarnings);

export default router;
