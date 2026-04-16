import { z } from 'zod'

export const CreateCourseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color_theme: z.string().nullable().optional(),
  icon_url: z.string().url().nullable().optional(),
})

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>

