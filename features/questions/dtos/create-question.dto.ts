import { z } from 'zod'

export const CreateQuestionSchema = z.object({
  nodeId: z.string()
    .uuid('El nodeId debe ser un UUID válido'),
  question_text: z.string()
    .min(5, 'La pregunta debe tener al menos 5 caracteres')
    .max(1000, 'La pregunta no puede exceder 1000 caracteres'),
  explanation_text: z.string()
    .max(2000, 'La explicación no puede exceder 2000 caracteres')
    .optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'])
    .default('BEGINNER'),
  question_type: z.enum(['MULTIPLE_CHOICE', 'DRAG_AND_DROP'])
    .default('MULTIPLE_CHOICE'),
})

export type CreateQuestionDTO = z.infer<typeof CreateQuestionSchema>
