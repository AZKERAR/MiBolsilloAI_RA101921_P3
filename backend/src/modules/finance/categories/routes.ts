import { Router } from 'express';
import { requireAuth } from '../../../middlewares/auth.ts';
import { validate } from '../../../middlewares/validate.ts';
import { CreateCategorySchema, UpdateCategorySchema } from './schema.ts';
import * as ctrl from './controller.ts';

const r = Router();
r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(CreateCategorySchema), ctrl.create);
r.put('/:id', validate(UpdateCategorySchema), ctrl.update);
r.delete('/:id', ctrl.remove);

export default r;