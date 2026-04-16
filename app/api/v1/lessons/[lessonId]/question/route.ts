import { NextRequest } from 'next/server';
import { ApiResponse } from '@/shared/response/api-response';
import { LessonService } from '@/features/lessons/services/lesson-services';

export async function GET(request: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const { lessonId } = params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') ?? undefined;

    const question = await LessonService.getNextQuestionForLesson(lessonId, userId ?? undefined);
    if (!question) return ApiResponse.error('Not Found', 404);

    return ApiResponse.success(question, 200);
  } catch (error: unknown) {
    console.error('[ERROR_GET_LESSON_QUESTION]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}

