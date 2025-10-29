import { z } from 'zod';

export const uuid = z.string().uuid();
export const nonEmpty = z.string().trim().min(1, 'requerido');

// Money: coerce a number y exige hasta 2 decimales (múltiplos de 0.01)
export const PositiveMoney = z.coerce.number()
  .gt(0, 'monto debe ser > 0')
  .refine(v => Number.isInteger(Math.round(v * 100)), 'Use hasta 2 decimales (ej. 10.50)');

// Enums alineados al schema.prisma
export const AccountType = z.enum(['cash','bank','credit_card','wallet','investment','other']);
export const TxnDirection = z.enum(['inflow','outflow']);

// Moneda: 3 letras en mayúsculas (ej. USD)
export const Currency3 = z.string()
  .trim()
  .length(3, 'moneda de 3 letras (p. ej. USD)')
  .transform(s => s.toUpperCase());

// Paginación base
export const PaginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});