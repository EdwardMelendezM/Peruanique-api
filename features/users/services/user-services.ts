import { prisma } from '@/libs/prisma';
import { CreateUserDTO } from '@/features/users/dtos/create-user.dto';
import {PaginationDTO} from "@/shared/dtos/pagination.dto";
import {paginate} from "@/shared/utils/paginator";

export const UserService = {
    async createUser(data: CreateUserDTO) {
        return prisma.user.create({data});
    },

  async getAllUsers(query: PaginationDTO) {
    const { page, limit, search } = query;

    return paginate(prisma.user, {
      where: search ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { full_name: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    }, { page, limit });
  }
};
