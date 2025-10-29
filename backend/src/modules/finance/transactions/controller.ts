import { RequestHandler } from 'express';
import * as svc from './service.ts';
import type { ListTransactionsQuery } from './schema.ts';

// GET /finance/transactions
export const listTransactions: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const query = ((req as any).validatedQuery as ListTransactionsQuery) || (req.query as unknown as ListTransactionsQuery);
    const result = await svc.listTransactions(userId, query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /finance/transactions
export const createTransaction: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const created = await svc.createTransaction(userId, req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PATCH /finance/transactions/:id
export const updateTransaction: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const { id } = ((req as any).validatedParams as { id: string }) || (req.params as { id: string });
    const updated = await svc.updateTransaction(userId, id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /finance/transactions/:id
export const deleteTransaction: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const { id } = ((req as any).validatedParams as { id: string }) || (req.params as { id: string });
    await svc.deleteTransaction(userId, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};