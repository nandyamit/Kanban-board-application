// server/src/routes/index.ts
import { Router, Request, Response } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Protected API routes
router.use('/api', authenticateToken, apiRoutes);

// Test route to verify API is working
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'API is working' });
});

export default router;