import { CreateQuestionSchema } from './create-question.dto';

export const UpdateQuestionSchema = CreateQuestionSchema.partial();

export type UpdateQuestionDTO = Partial<import('zod').infer<typeof CreateQuestionSchema>>;
