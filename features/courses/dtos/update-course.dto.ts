import { z } from 'zod'

// Validation schema para actualizar un curso
export const UpdateCourseSchema = z.object({
  id: z.string()
    .uuid('El ID debe ser un UUID válido'),
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  color_theme: z.string()
    .max(50, 'El color theme no puede exceder 50 caracteres')
    .optional(),
  icon_url: z.string()
    .url('El ícono debe ser una URL válida')
    .optional()
    .or(z.literal('')),
})

export type UpdateCourseDTO = z.infer<typeof UpdateCourseSchema>
