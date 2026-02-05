import { z } from 'zod';

export const CreateRoadmapNodeSchema = z.object({
  courseId: z.string().uuid('El courseId debe ser un UUID'),
  title: z.string().min(2, 'El título es requerido'),
  order_index: z.number().int().min(0, 'El order_index debe ser un entero >= 0'),
  difficulty_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL']).optional(),
  is_boss_level: z.boolean().optional(),
});

export type CreateRoadmapNodeDTO = z.infer<typeof CreateRoadmapNodeSchema>;

export default CreateRoadmapNodeSchema;
