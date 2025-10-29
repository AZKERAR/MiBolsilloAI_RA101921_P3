import { Router } from 'express';
import { requireAuth } from '../../../middlewares/auth.ts';
import { validate } from '../../../middlewares/validate.ts';
import { SummaryQuery } from './schema.ts';
import { getSummary } from './controller.ts';

const r = Router();
r.use(requireAuth);
r.get('/', validate(SummaryQuery, 'query'), getSummary);
export default r;