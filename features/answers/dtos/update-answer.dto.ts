import { z } from 'zod'

export const UpdateAnswerSchema = z.object({
  id: z.string()
    .uuid('El ID debe ser un UUID válido'),
  questionId: z.string()
    .uuid('El questionId debe ser un UUID válido')
    .optional(),
  answer_text: z.string()
    .min(1, 'La respuesta es requerida')
    .max(500, 'La respuesta no puede exceder 500 caracteres')
    .optional(),
  is_correct: z.boolean()
    .optional(),
})

export type UpdateAnswerDTO = z.infer<typeof UpdateAnswerSchema>
