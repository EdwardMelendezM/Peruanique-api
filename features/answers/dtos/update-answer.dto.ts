import CreateAnswerSchema from './create-answer.dto';

export const UpdateAnswerSchema = CreateAnswerSchema.partial();

export type UpdateAnswerDTO = Partial<import('zod').infer<typeof CreateAnswerSchema>>;
