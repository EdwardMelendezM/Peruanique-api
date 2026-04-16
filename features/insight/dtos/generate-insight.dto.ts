import { z } from 'zod';

export const GenerateInsightSchema = z.object({
  attemptId: z.string().uuid('attemptId debe ser un UUID'),
});

export type GenerateInsightDTO = z.infer<typeof GenerateInsightSchema>;

export default GenerateInsightSchema;

