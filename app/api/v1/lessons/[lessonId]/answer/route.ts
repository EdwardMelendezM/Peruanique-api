import { ApiResponse } from '@/shared/response/api-response';
import { LessonService } from '@/features/lessons/services/lesson-services';
import { SubmitAnswerSchema } from '@/features/lessons/dtos/submit-answer.dto';

export async function POST(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const { lessonId } = params;
    const body = await request.json();

    const parsed = SubmitAnswerSchema.safeParse(body);
    if (!parsed.success) return ApiResponse.error('Validation Failed', 422, parsed.error.flatten().fieldErrors);

    const dto = parsed.data;
    const result = await LessonService.submitAnswer({ userId: dto.userId, lessonId, questionId: dto.questionId, selectedAnswerId: dto.selectedOptionId, timeSpentSeconds: dto.timeSpentSeconds });

    return ApiResponse.success(result, 200);
  } catch (error: unknown) {
    console.error('[ERROR_SUBMIT_ANSWER]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}

