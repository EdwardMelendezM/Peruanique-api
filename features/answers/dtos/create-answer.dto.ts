import { z } from 'zod'

export const CreateAnswerSchema = z.object({
  questionId: z.string()
    .uuid('El questionId debe ser un UUID válido'),
  answer_text: z.string()
    .min(1, 'La respuesta es requerida')
    .max(500, 'La respuesta no puede exceder 500 caracteres'),
  is_correct: z.boolean()
    .default(false),
})

export type CreateAnswerDTO = z.infer<typeof CreateAnswerSchema>
