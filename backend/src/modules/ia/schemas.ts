// src/modules/ia/schemas.ts
import { z } from 'zod';

/** Formato rígido actual */
export const ContextV1 = z.object({
  currency: z.string().default('USD'),
  monthlyIncome: z.number().nonnegative().default(0),
  fixedCosts: z.number().nonnegative().default(0),
  currentBalance: z.number().nonnegative().default(0),
});

export const TipsRigid = z.object({
  goal: z.string().min(3, 'Describe una meta, p. ej. "comprar audífonos"'),
  targetAmount: z.number().positive('Debe ser > 0'),
  timeframe: z.object({
    unit: z.enum(['weeks', 'months']),
    value: z.number().int().positive(),
  }),
  context: ContextV1.default({
    currency: 'USD',
    monthlyIncome: 0,
    fixedCosts: 0,
    currentBalance: 0,
  }),
});

/** Formato NL: lenguaje natural con un solo campo */
export const TipsNL = z.object({
  prompt: z.string().min(3, 'Escribe tu objetivo en una frase'),
});

/** Unión: acepta rígido O NL */
export const tipsSchema = z.union([TipsRigid, TipsNL]);

export type TipsRigidInput = z.infer<typeof TipsRigid>;
export type TipsNLInput = z.infer<typeof TipsNL>;
export type TipsInput = z.infer<typeof tipsSchema>;

/** Tipo normalizado que SIEMPRE tiene las 4 propiedades requeridas */
export type NormalizedTips = {
  goal: string;
  targetAmount: number;
  timeframe: { unit: 'weeks' | 'months'; value: number };
  context: { currency: string; monthlyIncome: number; fixedCosts: number; currentBalance: number };
};

/* Categorize (igual que antes) */
export const categorizeSchema = z.object({
  text: z.string().min(1),
  amount: z.number().positive(),
  categories: z.array(
    z.enum(['Comida','Transporte','Vivienda','Entretenimiento','Otros'])
  ).default(['Comida','Transporte','Vivienda','Entretenimiento','Otros']),
});
export type CategorizeInput = z.infer<typeof categorizeSchema>;
