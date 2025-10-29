import { Router } from 'express';
import * as controller from './controller.ts';
import { listTransactionsQuerySchema, createTransactionSchema, updateTransactionSchema, idParamSchema } from './schema.ts';
import { validate } from '../../../middlewares/validate.ts';
import { requireAuth } from '../../../middlewares/auth.ts';

export const router = Router();

router.use(requireAuth);

// LISTAR (GET) — validar QUERY
router.get('/', validate(listTransactionsQuerySchema, 'query'), controller.listTransactions);

// CREAR (POST) — validar BODY
router.post('/', validate(createTransactionSchema, 'body'), controller.createTransaction);

// ACTUALIZAR (PATCH) — validar PARAMS + BODY
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateTransactionSchema, 'body'), controller.updateTransaction);

// ELIMINAR (DELETE) — validar PARAMS
router.delete('/:id', validate(idParamSchema, 'params'), controller.deleteTransaction);

export default router;