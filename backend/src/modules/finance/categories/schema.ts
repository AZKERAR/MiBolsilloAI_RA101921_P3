import { z } from 'zod';
import { nonEmpty } from '../common/schemas.ts';

export const CreateCategorySchema = z.object({
  name: nonEmpty,
  icon: z.string().trim().optional(),
  color: z.string().trim().optional(),
});
export const UpdateCategorySchema = CreateCategorySchema.partial();