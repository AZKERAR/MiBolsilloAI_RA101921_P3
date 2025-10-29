import { Router } from 'express';
import { requireAuth } from '../../../middlewares/auth.ts';
import { validate } from '../../../middlewares/validate.ts';
import {
  CreateAccountSchema,
  UpdateAccountSchema,
  InitializeAccountSchema,
  idParamSchema,
  balanceQuerySchema,
} from './schema.ts';
import * as ctrl from './controller.ts';

const r = Router();
r.use(requireAuth);

// ✅ Inicializar primera cuenta con balance inicial (DEBE SER LA PRIMERA RUTA)
r.post('/initialize', validate(InitializeAccountSchema, 'body'), ctrl.initialize);

// Listar cuentas
r.get('/', ctrl.list);

// Crear cuenta
r.post('/', validate(CreateAccountSchema, 'body'), ctrl.create);

// Actualizar cuenta
r.put('/:id',
  validate(idParamSchema, 'params'),
  validate(UpdateAccountSchema, 'body'),
  ctrl.update
);

// Eliminar cuenta
r.delete('/:id',
  validate(idParamSchema, 'params'),
  ctrl.remove
);

// ✅ Balance por cuenta (lo que “te queda”)
r.get('/:id/balance',
  validate(idParamSchema, 'params'),
  validate(balanceQuerySchema, 'query'),
  ctrl.getBalance
);

export default r;