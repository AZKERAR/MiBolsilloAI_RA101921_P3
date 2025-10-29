// src/lib/openai.ts
import OpenAI from 'openai';

/** ¿Hay OPENAI_API_KEY configurada (no vacía)? */
export const hasOpenAI = (): boolean =>
  Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);

/** Instancia única del cliente OpenAI (solo si hay API key). */
let instance: OpenAI | null = null;

if (hasOpenAI()) {
  instance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

/**
 * Exportamos `openai` para usarlo en aiService.
 * OJO: aiService SIEMPRE debe chequear `hasOpenAI()` antes de llamar a `openai`.
 * A nivel de tipos lo exponemos como OpenAI para no romper los imports.
 */
export const openai = instance as unknown as OpenAI;