import { prisma } from '@/libs/prisma';
import { CreateRoadmapNodeDTO } from '@/features/roadmap-nodes/dtos/create-roadmap-node.dto';
import { UpdateRoadmapNodeDTO } from '@/features/roadmap-nodes/dtos/update-roadmap-node.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { paginate } from '@/shared/utils/paginator';
import { Prisma } from '@/app/generated/prisma/client';

export const RoadmapNodeService = {
  async createRoadmapNode(data: CreateRoadmapNodeDTO) {
    return prisma.roadmapNode.create({ data });
  },

  async getAllRoadmapNodes(query: PaginationDTO & { courseId?: string }) {
    const { page, limit, search, courseId } = query;

    const where: Prisma.RoadmapNodeWhereInput = {};
    if (courseId) where.courseId = courseId;
    if (search) where.title = { contains: search, mode: 'insensitive' } as any;

    // If courseId provided, it's often useful to order by order_index
    const orderBy = courseId ? { order_index: 'asc' } : { createdAt: 'desc' };

    return paginate(prisma.roadmapNode, { where, orderBy }, { page, limit });
  },

  async getRoadmapNodeById(id: string) {
    return prisma.roadmapNode.findUnique({ where: { id } });
  },

  async getRoadmapNodeWithQuestions(id: string) {
    return prisma.roadmapNode.findUnique({ where: { id }, include: { questions: true } });
  },

  async updateRoadmapNode(id: string, data: UpdateRoadmapNodeDTO) {
    return prisma.roadmapNode.update({ where: { id }, data });
  },

  async deleteRoadmapNode(id: string) {
    return prisma.roadmapNode.delete({ where: { id } });
  }
};
