import { z } from 'zod'

/**
 * DTO para crear una lección
 * Una lección representa una unidad de aprendizaje dentro de un curso
 */
export const CreateLessonSchema = z.object({
  courseId: z.string()
    .uuid('El courseId debe ser un UUID válido'),
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres'),
  order_index: z.number()
    .int('El índice debe ser un número entero')
    .min(0, 'El índice no puede ser negativo'),
  difficulty_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'])
    .default('BEGINNER'),
  is_published: z.boolean()
    .default(false),
})

export type CreateLessonDTO = z.infer<typeof CreateLessonSchema>

