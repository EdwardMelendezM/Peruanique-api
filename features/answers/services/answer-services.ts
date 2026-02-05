import { prisma } from '@/libs/prisma';
import { CreateAnswerDTO } from '@/features/answers/dtos/create-answer.dto';
import { UpdateAnswerDTO } from '@/features/answers/dtos/update-answer.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { paginate } from '@/shared/utils/paginator';
import { Prisma } from '@/app/generated/prisma/client';

export const AnswerService = {
  async createAnswer(data: CreateAnswerDTO) {
    return prisma.answer.create({ data });
  },

  async getAllAnswers(query: PaginationDTO & { questionId?: string }) {
    const { page, limit, search, questionId } = query;

    const where: Prisma.AnswerWhereInput = {};
    if (questionId) where.questionId = questionId;
    if (search) {
      const textFilter: Prisma.StringFilter = { contains: search, mode: 'insensitive' };
      where.answer_text = textFilter as unknown as Prisma.StringFilter;
    }

    const orderBy = { createdAt: 'desc' };

    return paginate(prisma.answer, { where, orderBy }, { page, limit });
  },

  async getAnswerById(id: string) {
    return prisma.answer.findUnique({ where: { id } });
  },

  async updateAnswer(id: string, data: UpdateAnswerDTO) {
    return prisma.answer.update({ where: { id }, data });
  },

  async deleteAnswer(id: string) {
    return prisma.answer.delete({ where: { id } });
  }
};
