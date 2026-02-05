import { z } from 'zod';

export const CreateAnswerSchema = z.object({
  questionId: z.string().uuid('El questionId debe ser un UUID'),
  answer_text: z.string().min(1, 'El texto de la respuesta es requerido'),
  is_correct: z.boolean().optional(),
});

export type CreateAnswerDTO = z.infer<typeof CreateAnswerSchema>;

export default CreateAnswerSchema;
