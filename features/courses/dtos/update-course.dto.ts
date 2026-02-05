import { CreateCourseSchema } from './create-course.dto';

export const UpdateCourseSchema = CreateCourseSchema.partial();

export type UpdateCourseDTO = Partial<import('zod').infer<typeof CreateCourseSchema>>;
