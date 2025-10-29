import { z } from 'zod';

export const SummaryQuery = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});