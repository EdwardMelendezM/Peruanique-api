import { CreateCourseSchema } from '@/features/courses/dtos/create-course.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { CourseService } from '@/features/courses/services/course-services';
import { isPrismaError } from '@/shared/utils/error-handler';
import { NextRequest } from 'next/server';
import { parseQueryParams } from '@/shared/utils/query-parser';
import { PaginationSchema } from '@/shared/dtos/pagination.dto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateCourseSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const newCourse = await CourseService.createCourse(result.data);

    return ApiResponse.success(newCourse, 201);
  } catch (error: unknown) {
    console.error('[ERROR_CREATE_COURSE]:', error);

    if (isPrismaError(error)) {
      if (error.code === 'P2002') {
        return ApiResponse.error('Course already exists', 409);
      }
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const rawParams = parseQueryParams(request.url);
    const result = PaginationSchema.safeParse(rawParams);

    if (!result.success) {
      return ApiResponse.error('Invalid query parameters', 422, result.error.flatten().fieldErrors);
    }

    const { data, meta } = await CourseService.getAllCourses(result.data);

    return ApiResponse.success({ items: data, meta });
  } catch (error: unknown) {
    console.error('[ERROR_GET_COURSES]:', error);

    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}
