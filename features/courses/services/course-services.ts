import { prisma } from '@/libs/prisma';
import { CreateCourseDTO } from '@/features/courses/dtos/create-course.dto';
import { UpdateCourseDTO } from '@/features/courses/dtos/update-course.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { paginate } from '@/shared/utils/paginator';

export const CourseService = {
  async createCourse(data: CreateCourseDTO) {
    return prisma.course.create({ data });
  },

  async getAllCourses(query: PaginationDTO) {
    const { page, limit, search } = query;

    return paginate(prisma.course, {
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : {},
      orderBy: { createdAt: 'desc' }
    }, { page, limit });
  },

  async getCourseById(id: string) {
    return prisma.course.findUnique({ where: { id } });
  },

  async updateCourse(id: string, data: UpdateCourseDTO) {
    return prisma.course.update({ where: { id }, data });
  },

  async deleteCourse(id: string) {
    return prisma.course.delete({ where: { id } });
  }
};
