import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

/**
 * Valida body/query/params con un schema de Zod (por defecto body).
 * Evita reasignar req.query/req.params (getters en Express 5).
 * Expone los valores ya validados/coercionados en:
 *  - req.body            (cuando where === 'body')
 *  - (req as any).validatedQuery
 *  - (req as any).validatedParams
 */
export function validate<T extends ZodSchema<any>>(
  schema: T,
  where: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const raw = (req as any)[where];
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const issues = (parsed.error as ZodError).issues.map((i) => ({
        path: i.path.join('.') || where,
        message: i.message,
        received: (i as any).received,
      }));
      return res.status(400).json({ 
        message: 'Entrada inválida', 
        issues,
        hint: `Verifica que el Content-Type sea application/json y que el ${where} tenga el formato correcto`
      });
    }

    // ✅ Guardamos SIEMPRE lo validado/coercionado en propiedades “seguras”.
    switch (where) {
      case 'query': {
        (req as any).validatedQuery = parsed.data;
        break;
      }
      case 'params': {
        (req as any).validatedParams = parsed.data;
        break;
      }
      default: { // body sí es reasignable
        (req as any).body = parsed.data;
        break;
      }
    }

    next();
  };
}
