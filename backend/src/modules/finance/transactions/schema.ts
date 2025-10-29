import { z } from 'zod';
import { uuid, TxnDirection, PositiveMoney, PaginationQuery, Currency3 } from '../common/schemas.ts';

/**
 * Body para crear transacción
 * POST /finance/transactions
 */
export const createTransactionSchema = z.object({
  accountId: uuid,
  categoryId: uuid.nullable().optional(),
  direction: TxnDirection,                // 'inflow' | 'outflow'
  amount: PositiveMoney,                  // > 0, hasta 2 decimales
  currency: Currency3.default('USD'),     // 3 letras (USD por defecto)
  occurredAt: z.coerce.date(),            // acepta 'YYYY-MM-DD' o ISO
  note: z.string().trim().optional(),
});
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

/**
 * Body para actualizar transacción
 * PATCH /finance/transactions/:id
 * (partial pero con tipos estrictos)
 */
export const updateTransactionSchema = z.object({
  accountId: uuid.optional(),
  categoryId: z.union([uuid, z.null()]).optional(),
  direction: TxnDirection.optional(),
  amount: PositiveMoney.optional(),
  currency: Currency3.optional(),
  occurredAt: z.coerce.date().optional(),
  note: z.string().trim().optional(),
});
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

/**
 * Params con :id
 */
export const idParamSchema = z.object({
  id: uuid,
});
export type IdParam = z.infer<typeof idParamSchema>;

/**
 * Query para listar transacciones
 * GET /finance/transactions
 */
export const listTransactionsQuerySchema = PaginationQuery.extend({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  accountId: uuid.optional(),
  categoryId: uuid.optional(),
  direction: TxnDirection.optional(),
});
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;