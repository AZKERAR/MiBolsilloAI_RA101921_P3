import { RequestHandler } from 'express';
import { prisma } from '../../../lib/prisma.ts';
import { TxnDirection } from '@prisma/client';

export const getSummary: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;

    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to   = req.query.to   ? new Date(String(req.query.to))   : undefined;

    // Construye occurredAt sin keys undefined
    const occurredAt =
      from || to
        ? {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          }
        : undefined;

    const baseWhere = { userId, ...(occurredAt ? { occurredAt } : {}) };

    const [inflowAgg, outflowAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...baseWhere, direction: TxnDirection.inflow },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...baseWhere, direction: TxnDirection.outflow },
        _sum: { amount: true },
      }),
    ]);

    // Convierte Decimal | null a number
    const inflowTotal  = Number(inflowAgg._sum.amount ?? 0);
    const outflowTotal = Number(outflowAgg._sum.amount ?? 0);
    const net          = inflowTotal - outflowTotal;

    const byCategory = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { ...baseWhere, direction: TxnDirection.outflow },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const categories = await prisma.category.findMany({
      where: { userId, id: { in: byCategory.map(b => b.categoryId!).filter(Boolean) } },
    });

    res.json({
      from,
      to,
      totals: {
        inflow: inflowTotal,
        outflow: outflowTotal,
        net,
      },
      expensesByCategory: byCategory.map(row => ({
        categoryId: row.categoryId,
        categoryName: categories.find(c => c.id === row.categoryId)?.name ?? '(sin categoría)',
        total: Number(row._sum.amount ?? 0),
      })),
    });
  } catch (err) {
    next(err);
  }
};