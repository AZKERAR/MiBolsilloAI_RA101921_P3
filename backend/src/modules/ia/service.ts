// src/modules/ia/service.ts
import { openai, hasOpenAI } from '../../lib/openai.ts';
import type { TipsInput, NormalizedTips, CategorizeInput } from './schemas.ts';

const SYSTEM_TIPS = `Eres un asesor financiero práctico.
Responde SOLO en JSON válido (sin texto adicional).
Políticas:
- No prometas rendimientos.
- Respeta la moneda provista.
- Muestra "plan_semanal" o "plan_mensual" según timeframe.
- Incluye 2-4 consejos de recorte realistas (comida, transporte, entretenimiento).
Devuelve JSON estricto con la forma:
{
  "resumen": string,
  "meta": { "descripcion": string, "monto_objetivo": number, "plazo": { "unidad": "weeks"|"months", "valor": number } },
  "plan": { "aporte_por_periodo": number, "periodos": number, "plan_semanal"?: { "aporte": number }, "plan_mensual"?: { "aporte": number } },
  "consejos": string[],
  "riesgos": string[]
}`;

const SYSTEM_CATEG = `Eres un clasificador de gastos.
Responde SOLO en JSON válido (sin texto adicional).
Devuelve {"categoria": "...", "confianza": 0-1}.
Usa solo: Comida, Transporte, Vivienda, Entretenimiento, Otros.`;

/** Normaliza TipsInput (rígido o NL) al tipo completo NormalizedTips */
function normalizeTipsInput(input: TipsInput): NormalizedTips {
  if ('goal' in input) {
    // ya viene en formato rígido
    return {
      goal: input.goal,
      targetAmount: input.targetAmount,
      timeframe: input.timeframe,
      context: input.context,
    };
  }

  // Modo NL: extrae primer número como targetAmount; 4 semanas y USD por defecto
  const prompt = input.prompt;
  const m = prompt.match(/(\d+(\.\d+)?)/);
  const targetAmount = m ? Number(m[1]) : 50;

  return {
    goal: prompt,
    targetAmount,
    timeframe: { unit: 'weeks', value: 4 },
    context: { currency: 'USD', monthlyIncome: 0, fixedCosts: 0, currentBalance: 0 },
  };
}

// ---------- Fallbacks deterministas ----------
function fallbackTips(input: NormalizedTips) {
  const { targetAmount, timeframe, context, goal } = input;
  const periods = timeframe.value;
  const aporte = Number((targetAmount / periods).toFixed(2));

  const consejos = [
    'Registra todo gasto en la app inmediatamente',
    'Reduce comidas fuera a la mitad esta semana',
    'Usa transporte público o comparte viajes 2 días',
    'Evita compras por impulso: espera 48h',
  ];

  const riesgos = [
    'Ingresos variables pueden retrasar la meta',
    'Gastos imprevistos (salud, estudios) afectan el plan',
  ];

  const plan: any = { aporte_por_periodo: aporte, periodos: periods };
  if (timeframe.unit === 'weeks') plan.plan_semanal = { aporte };
  if (timeframe.unit === 'months') plan.plan_mensual = { aporte };

  return {
    resumen: `Ahorra ${aporte} ${context.currency} por ${timeframe.unit === 'weeks' ? 'semana' : 'mes'} para lograr "${goal}".`,
    meta: {
      descripcion: goal,
      monto_objetivo: targetAmount,
      plazo: { unidad: timeframe.unit, valor: periods },
    },
    plan,
    consejos,
    riesgos,
  };
}

function fallbackCategorize(input: CategorizeInput) {
  const t = input.text.toLowerCase();
  if (/(pupusa|pizza|almuerzo|cena|comida|restaurante|soda|snack)/.test(t)) return { categoria: 'Comida', confianza: 0.7 };
  if (/(bus|uber|taxi|gasolina|pasaje|transporte|combustible)/.test(t)) return { categoria: 'Transporte', confianza: 0.7 };
  if (/(renta|alquiler|agua|luz|electricidad|internet|servicio|cable)/.test(t)) return { categoria: 'Vivienda', confianza: 0.7 };
  if (/(cine|netflix|spotify|juego|concierto|entretenimiento)/.test(t)) return { categoria: 'Entretenimiento', confianza: 0.7 };
  return { categoria: 'Otros', confianza: 0.5 };
}

// ---------- Servicio ----------
export const aiService = {
  async getTips(rawInput: TipsInput): Promise<{ data: any; source: 'openai' | 'fallback'; error?: any }> {
    const input = normalizeTipsInput(rawInput);

    const userContent = JSON.stringify({
      goal: input.goal,
      targetAmount: input.targetAmount,
      timeframe: input.timeframe,
      context: input.context,
    });

    if (!hasOpenAI()) {
      console.warn('[IA][tips] Sin OPENAI_API_KEY → fallback');
      return { data: fallbackTips(input), source: 'fallback' };
    }

    try {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        response_format: { type: 'json_object' as const },
        messages: [
          { role: 'system', content: SYSTEM_TIPS },
          { role: 'user', content: `Responde en JSON. Entrada:\n${userContent}` },
        ],
      });

      const raw = resp.choices?.[0]?.message?.content?.trim() || '';
      const parsed = JSON.parse(raw);
      console.log('[IA][tips] ✅ OpenAI respondió OK');
      return { data: parsed, source: 'openai' };
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const msg = err?.message || err?.response?.data || String(err);
      console.error('[IA][tips] ❌ OpenAI error → fallback', { status, msg });
      return { data: fallbackTips(input), source: 'fallback', error: { status, msg } };
    }
  },

  async categorize(input: CategorizeInput): Promise<{ data: any; source: 'openai' | 'fallback'; error?: any }> {
    const userContent = JSON.stringify({
      text: input.text,
      amount: input.amount,
      categories: input.categories,
    });

    if (!hasOpenAI()) {
      console.warn('[IA][categorize] Sin OPENAI_API_KEY → fallback');
      return { data: fallbackCategorize(input), source: 'fallback' };
    }

    try {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' as const },
        messages: [
          { role: 'system', content: SYSTEM_CATEG },
          { role: 'user', content: `Responde en JSON. Entrada:\n${userContent}` },
        ],
      });

      const raw = resp.choices?.[0]?.message?.content?.trim() || '';
      const parsed = JSON.parse(raw);
      if (!input.categories.includes(parsed.categoria)) parsed.categoria = 'Otros';

      console.log('[IA][categorize] ✅ OpenAI respondió OK');
      return { data: parsed, source: 'openai' };
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      const msg = err?.message || err?.response?.data || String(err);
      console.error('[IA][categorize] ❌ OpenAI error → fallback', { status, msg });
      return { data: fallbackCategorize(input), source: 'fallback', error: { status, msg } };
    }
  },
};