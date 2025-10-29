import { RequestHandler } from 'express';
import * as svc from './service.ts';

export const list: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    res.json(await svc.listAccounts(userId));
  } catch (e) {
    next(e);
  }
};

export const initialize: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const result = await svc.initializeAccount(userId, req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    res.status(201).json(await svc.createAccount(userId, req.body));
  } catch (e) {
    next(e);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const { id } =
      ((req as any).validatedParams as { id: string }) || (req.params as { id: string });
    res.json(await svc.updateAccount(userId, id, req.body));
  } catch (e) {
    next(e);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const { id } =
      ((req as any).validatedParams as { id: string }) || (req.params as { id: string });
    await svc.deleteAccount(userId, id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

/** GET /finance/accounts/:id/balance */
export const getBalance: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId as string;
    const { id } =
      ((req as any).validatedParams as { id: string }) || (req.params as { id: string });
    const query = ((req as any).validatedQuery ?? req.query) as { asOf?: Date };
    const result = await svc.getAccountBalance(userId, id, query);
    res.json(result);
  } catch (e) {
    next(e);
  }
};