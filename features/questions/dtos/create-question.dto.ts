import { z } from 'zod';

export const CreateQuestionSchema = z.object({
  nodeId: z.string().uuid('El nodeId debe ser un UUID'),
  question_text: z.string().min(2, 'El texto de la pregunta es requerido'),
  explanation_text: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL']).optional(),
  question_type: z.enum(['MULTIPLE_CHOICE', 'DRAG_AND_DROP']).optional(),
});

export type CreateQuestionDTO = z.infer<typeof CreateQuestionSchema>;

export default CreateQuestionSchema;
