import { prisma } from '../../../lib/prisma.ts';
import { TxnDirection, Prisma } from '@prisma/client';
import type { CreateTransactionInput, UpdateTransactionInput, ListTransactionsQuery } from './schema.ts';

/** Asegura que la cuenta pertenece al usuario */
async function ensureAccountOwned(userId: string, accountId: string) {
  const acc = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!acc) {
    throw Object.assign(new Error('Cuenta no encontrada o no pertenece al usuario'), { status: 403 });
  }
}

/** Asegura que la categoría pertenece al usuario */
async function ensureCategoryOwned(userId: string, categoryId: string) {
  const cat = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!cat) {
    throw Object.assign(new Error('Categoría no encontrada o no pertenece al usuario'), { status: 403 });
  }
}

/** Asegura que la transacción pertenece al usuario antes de operar */
async function ensureOwned(userId: string, id: string) {
  const txn = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!txn) throw Object.assign(new Error('No encontrada'), { status: 404 });
  return txn;
}

/** Construye el WHERE en base al userId y la query validada */
function buildWhere(userId: string, q: ListTransactionsQuery): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId };

  if (q.from || q.to) {
    where.occurredAt = {
      ...(q.from ? { gte: q.from } : {}),
      ...(q.to ? { lte: q.to } : {}),
    };
  }
  if (q.accountId) where.accountId = q.accountId;
  if (q.categoryId) where.categoryId = q.categoryId;
  if (q.direction) where.direction = q.direction as TxnDirection;

  return where;
}

export async function listTransactions(userId: string, q: ListTransactionsQuery) {
  const page = Number(q.page ?? 1);
  const pageSize = Number(q.pageSize ?? 20);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where = buildWhere(userId, q);

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      skip,
      take,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { page, pageSize, total, items };
}

export async function createTransaction(userId: string, input: CreateTransactionInput) {
  // Verificar pertenencia de account y category
  await ensureAccountOwned(userId, input.accountId);
  if (input.categoryId) await ensureCategoryOwned(userId, input.categoryId);

  return prisma.transaction.create({
    data: {
      userId,
      accountId: input.accountId,
      categoryId: input.categoryId ?? null,
      direction: input.direction,
      amount: input.amount,
      currency: input.currency ?? 'USD',
      occurredAt: input.occurredAt,
      note: input.note,
    },
  });
}

export async function updateTransaction(userId: string, id: string, input: UpdateTransactionInput) {
  const current = await ensureOwned(userId, id);

  // Resolver IDs “destino” para validar pertenencia
  const nextAccountId = input.accountId ?? current.accountId;
  const nextCategoryId =
    Object.prototype.hasOwnProperty.call(input, 'categoryId')
      ? (input.categoryId ?? null)
      : current.categoryId;

  await ensureAccountOwned(userId, nextAccountId);
  if (nextCategoryId) await ensureCategoryOwned(userId, nextCategoryId);

  return prisma.transaction.update({
    where: { id },
    data: {
      ...(input.accountId !== undefined ? { accountId: input.accountId } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId ?? null } : {}),
      ...(input.direction !== undefined ? { direction: input.direction } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.occurredAt !== undefined ? { occurredAt: input.occurredAt } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
    },
  });
}

export async function deleteTransaction(userId: string, id: string) {
  await ensureOwned(userId, id);
  await prisma.transaction.delete({ where: { id } });
}