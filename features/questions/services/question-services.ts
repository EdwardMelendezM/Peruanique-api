import { prisma } from '@/libs/prisma';
import { CreateQuestionDTO } from '@/features/questions/dtos/create-question.dto';
import { UpdateQuestionDTO } from '@/features/questions/dtos/update-question.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { paginate } from '@/shared/utils/paginator';
import { Prisma } from '@/app/generated/prisma/client';

export const QuestionService = {
  async createQuestion(data: CreateQuestionDTO) {
    return prisma.question.create({ data });
  },

  async getAllQuestions(query: PaginationDTO & { nodeId?: string }) {
    const { page, limit, search, nodeId } = query;

    const where: Prisma.QuestionWhereInput = {};
    if (nodeId) where.nodeId = nodeId;
    if (search) {
      const textFilter: Prisma.StringFilter = { contains: search, mode: 'insensitive' };
      where.question_text = textFilter as any; // prisma typings sometimes expect StringFilter | StringNullableFilter
    }

    const orderBy = { createdAt: 'desc' };

    return paginate(prisma.question, { where, orderBy }, { page, limit });
  },

  async getQuestionById(id: string) {
    return prisma.question.findUnique({ where: { id } });
  },

  async getQuestionWithAnswers(id: string) {
    return prisma.question.findUnique({ where: { id }, include: { answers: true } });
  },

  async updateQuestion(id: string, data: UpdateQuestionDTO) {
    return prisma.question.update({ where: { id }, data });
  },

  async deleteQuestion(id: string) {
    return prisma.question.delete({ where: { id } });
  }
};
