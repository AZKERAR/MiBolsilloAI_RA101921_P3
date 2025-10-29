// src/modules/ia/routes.ts
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { aiController } from './controller.ts';
import { requireAuth } from '../../middlewares/auth.ts';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiRoutes = Router();
aiRoutes.use(requireAuth, limiter);

aiRoutes.post('/tips', aiController.tips);
aiRoutes.post('/categorize', aiController.categorize);