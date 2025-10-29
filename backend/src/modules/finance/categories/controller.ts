import { RequestHandler } from 'express';
import * as svc from './service.ts';

export const list: RequestHandler = async (req, res, next) => {
  try { res.json(await svc.listCategories((req as any).userId)); } catch (e) { next(e); }
};
export const create: RequestHandler = async (req, res, next) => {
  try { res.status(201).json(await svc.createCategory((req as any).userId, req.body)); } catch (e) { next(e); }
};
export const update: RequestHandler = async (req, res, next) => {
  try { res.json(await svc.updateCategory((req as any).userId, req.params.id, req.body)); } catch (e) { next(e); }
};
export const remove: RequestHandler = async (req, res, next) => {
  try { await svc.deleteCategory((req as any).userId, req.params.id); res.status(204).end(); } catch (e) { next(e); }
};