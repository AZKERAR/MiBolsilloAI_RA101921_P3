import { prisma } from '../../../lib/prisma.ts';
import type { AccountType } from '@prisma/client';
import type { BalanceQuery } from './schema.ts';
import { TxnDirection } from '@prisma/client';

async function ensureAccountOwned(userId: string, accountId: string) {
  const acc = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!acc) {
    throw Object.assign(new Error('Cuenta no encontrada o no pertenece al usuario'), { status: 404 });
  }
  return acc;
}

/**
 * Inicializa la primera cuenta del usuario con un balance inicial.
 * Solo se puede ejecutar UNA VEZ (cuando el usuario no tiene cuentas).
 */
export async function initializeAccount(
  userId: string,
  dto: { name: string; type: AccountType; initialAmount: number; currency?: string }
) {
  // Verificar que no tenga cuentas
  const existing = await prisma.account.count({ where: { userId } });
  if (existing > 0) {
    throw Object.assign(
      new Error('El usuario ya tiene cuentas. Usa el endpoint normal para crear más cuentas.'), 
      { status: 400 }
    );
  }

  // Validar que el monto inicial sea positivo
  if (dto.initialAmount <= 0) {
    throw Object.assign(new Error('El monto inicial debe ser mayor a 0'), { status: 400 });
  }

  // Crear cuenta y transacción inicial en una transacción de BD
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        currency: dto.currency ?? 'USD',
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        userId,
        accountId: account.id,
        direction: TxnDirection.inflow,
        amount: dto.initialAmount,
        currency: dto.currency ?? 'USD',
        occurredAt: new Date(),
        note: 'Balance inicial',
      },
    });

    return { account, transaction, balance: dto.initialAmount };
  });
}

export function listAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export function createAccount(
  userId: string,
  dto: { name: string; type: AccountType; currency?: string }
) {
  return prisma.account.create({
    data: {
      userId,
      name: dto.name,
      type: dto.type,
      currency: dto.currency ?? 'USD',
    },
  });
}

export async function updateAccount(
  userId: string,
  id: string,
  dto: Partial<{ name: string; type: AccountType; currency: string }>
) {
  await ensureAccountOwned(userId, id);
  return prisma.account.update({ where: { id }, data: dto });
}

export async function deleteAccount(userId: string, id: string) {
  await ensureAccountOwned(userId, id);
  await prisma.transaction.deleteMany({ where: { userId, accountId: id } });
  return prisma.account.delete({ where: { id } });
}

/**
 * Balance acumulado (lo que “te queda” en la cuenta) hasta asOf (o ahora).
 * balance = sum(inflow) - sum(outflow)
 */
export async function getAccountBalance(userId: string, accountId: string, q: BalanceQuery) {
  const asOf = q.asOf ?? new Date();

  await ensureAccountOwned(userId, accountId);

  const [inflowAgg, outflowAgg] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        accountId,
        direction: TxnDirection.inflow,
        occurredAt: { lte: asOf },
      },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        accountId,
        direction: TxnDirection.outflow,
        occurredAt: { lte: asOf },
      },
    }),
  ]);

  const inflow = Number(inflowAgg._sum.amount ?? 0);
  const outflow = Number(outflowAgg._sum.amount ?? 0);
  const balance = inflow - outflow;

  // Devolvemos como strings con 2 decimales para ser consistentes con Decimal
  return {
    accountId,
    asOf: asOf.toISOString(),
    inflow: inflow.toFixed(2),
    outflow: outflow.toFixed(2),
    balance: balance.toFixed(2),
  };
}