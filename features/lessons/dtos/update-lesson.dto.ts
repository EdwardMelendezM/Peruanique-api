import { z } from 'zod'

/**
 * DTO para actualizar una lección
 */
export const UpdateLessonSchema = z.object({
  id: z.string()
    .uuid('El ID debe ser un UUID válido'),
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres')
    .optional(),
  order_index: z.number()
    .int('El índice debe ser un número entero')
    .min(0, 'El índice no puede ser negativo')
    .optional(),
  difficulty_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'])
    .optional(),
  is_published: z.boolean()
    .optional(),
})

export type UpdateLessonDTO = z.infer<typeof UpdateLessonSchema>

