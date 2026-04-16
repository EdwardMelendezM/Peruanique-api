import { z } from 'zod'

export const UpdateQuestionSchema = z.object({
  id: z.string()
    .uuid('El ID debe ser un UUID válido'),
  nodeId: z.string()
    .uuid('El nodeId debe ser un UUID válido')
    .optional(),
  question_text: z.string()
    .min(5, 'La pregunta debe tener al menos 5 caracteres')
    .max(1000, 'La pregunta no puede exceder 1000 caracteres')
    .optional(),
  explanation_text: z.string()
    .max(2000, 'La explicación no puede exceder 2000 caracteres')
    .optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'])
    .optional(),
  question_type: z.enum(['MULTIPLE_CHOICE', 'DRAG_AND_DROP'])
    .optional(),
})

export type UpdateQuestionDTO = z.infer<typeof UpdateQuestionSchema>
