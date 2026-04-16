import { z } from 'zod';

export const SubmitAnswerSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID'),
  questionId: z.string().uuid('questionId debe ser un UUID'),
  selectedOptionId: z.string().uuid('selectedOptionId debe ser un UUID').optional(),
  timeSpentSeconds: z.number().int().nonnegative().optional(),
});

export type SubmitAnswerDTO = z.infer<typeof SubmitAnswerSchema>;

export default SubmitAnswerSchema;

