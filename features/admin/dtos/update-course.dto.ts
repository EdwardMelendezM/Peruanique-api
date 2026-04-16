import { z } from 'zod'

export const UpdateCourseSchema = z.object({
  id: z.string().uuid('Invalid id'),
  name: z.string().min(1, 'Name is required').optional(),
  color_theme: z.string().nullable().optional(),
  icon_url: z.string().url().nullable().optional(),
})

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>

