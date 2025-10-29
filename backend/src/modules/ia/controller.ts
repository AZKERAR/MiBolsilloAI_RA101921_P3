import type { Request, Response } from 'express';
import { tipsSchema, categorizeSchema } from './schemas.ts';
import { aiService } from './service.ts';

export const aiController = {
  tips: async (req: Request, res: Response) => {
    const parsed = tipsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { data, source, error } = await aiService.getTips(parsed.data);
    res.setHeader('x-ai-source', source);

    if (source === 'openai') return res.json({ ok: true, source, data });
    if (error) return res.status(502).json({ ok: false, source, error, message: 'OpenAI falló' });

    // (solo ocurre si no hay API key)
    return res.json({ ok: true, source, data });
  },

  categorize: async (req: Request, res: Response) => {
    const parsed = categorizeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { data, source, error } = await aiService.categorize(parsed.data);
    res.setHeader('x-ai-source', source);

    if (source === 'openai') return res.json({ ok: true, source, data });
    if (error) return res.status(502).json({ ok: false, source, error, message: 'OpenAI falló' });

    return res.json({ ok: true, source, data });
  },
};