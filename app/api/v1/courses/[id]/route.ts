import { UpdateCourseSchema } from '@/features/courses/dtos/update-course.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { CourseService } from '@/features/courses/services/course-services';
import { isPrismaError } from '@/shared/utils/error-handler';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const course = await CourseService.getCourseById(id);

    if (!course) return ApiResponse.error('Not Found', 404);

    return ApiResponse.success(course);
  } catch (error: unknown) {
    console.error('[ERROR_GET_COURSE]:', error);
    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const result = UpdateCourseSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const updated = await CourseService.updateCourse(id, result.data);

    return ApiResponse.success(updated);
  } catch (error: unknown) {
    console.error('[ERROR_UPDATE_COURSE]:', error);

    if (isPrismaError(error)) {
      if ((error as any).code === 'P2002') {
        return ApiResponse.error('Course name conflict', 409);
      }
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await CourseService.deleteCourse(id);

    return ApiResponse.success({}, 204);
  } catch (error: unknown) {
    console.error('[ERROR_DELETE_COURSE]:', error);

    if (isPrismaError(error)) {
      // e.g., foreign key constraint or not found
      return ApiResponse.error('Cannot delete course', 400);
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}
