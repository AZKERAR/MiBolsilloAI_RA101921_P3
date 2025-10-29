import { z } from 'zod';
import { AccountType, nonEmpty, Currency3, uuid } from '../common/schemas.ts';

export const CreateAccountSchema = z.object({
  name: nonEmpty,
  type: AccountType,
  currency: Currency3.default('USD'), // 3 letras mayúsculas
});

export const UpdateAccountSchema = CreateAccountSchema.partial();

// Schema para inicializar la primera cuenta con balance inicial
export const InitializeAccountSchema = z.object({
  name: nonEmpty,
  type: AccountType,
  initialAmount: z.coerce.number().positive('El monto inicial debe ser mayor a 0'),
  currency: Currency3.default('USD'),
});

export const idParamSchema = z.object({
  id: uuid,
});

// Query para saldo "as of" (si no viene, usamos ahora)
export const balanceQuerySchema = z.object({
  asOf: z.coerce.date().optional(),
});

// Tipos (opcional)
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
export type InitializeAccountInput = z.infer<typeof InitializeAccountSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type BalanceQuery = z.infer<typeof balanceQuerySchema>;