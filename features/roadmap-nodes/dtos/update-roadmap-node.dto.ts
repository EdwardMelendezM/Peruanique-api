import { CreateRoadmapNodeSchema } from './create-roadmap-node.dto';

export const UpdateRoadmapNodeSchema = CreateRoadmapNodeSchema.partial();

export type UpdateRoadmapNodeDTO = Partial<import('zod').infer<typeof CreateRoadmapNodeSchema>>;
