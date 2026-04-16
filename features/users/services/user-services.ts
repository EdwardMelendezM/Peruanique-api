import { prisma } from '@/libs/prisma';
import type { Prisma } from '@/app/generated/prisma/client';
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
,

  async getDisabledUsers() {
    // Cast `where` to any to avoid mismatches between generated Prisma types in the
    // editor/tsserver and runtime client during development. This is safe here
    // because the field exists in the database schema and generated client.
    return prisma.user.findMany({
      where: { is_disabled: true } as Prisma.UserWhereInput,
      select: { id: true, email: true, full_name: true, createdAt: true }
    });
  }

  ,

  async getProfileStats(userId: string) {
    // completedLessons: count of UserProgress with status COMPLETED
    const completedLessons = await prisma.userProgress.count({ where: { userId, status: 'COMPLETED' } });

    // points and streak are stored on User
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { total_xp: true, streak_days: true } });

    const points = user?.total_xp ?? 0;
    const streak = user?.streak_days ?? 0;

    // simple level calculation (example): 100 XP per level
    const level = Math.floor(points / 100);

    return { completedLessons, points, streak, level };
  }
};
