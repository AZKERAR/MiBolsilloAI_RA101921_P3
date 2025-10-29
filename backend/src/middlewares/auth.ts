// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const { JWT_SECRET = '' } = process.env;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.header('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!token) {
      return res.status(401).json({ message: 'No autorizado: falta token' });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId?: string; sub?: string };

    const userId = payload.userId || payload.sub;
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado: token inválido' });
    }

    (req as any).userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: 'No autorizado: token inválido' });
  }
}