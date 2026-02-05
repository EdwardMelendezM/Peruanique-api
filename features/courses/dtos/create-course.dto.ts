import { z } from 'zod';

export const CreateCourseSchema = z.object({
  name: z.string().min(2, 'El nombre del curso es requerido'),
  color_theme: z.string().optional(),
  icon_url: z.string().url('Debe ser una URL válida').optional(),
});

export type CreateCourseDTO = z.infer<typeof CreateCourseSchema>;

export default CreateCourseSchema;
