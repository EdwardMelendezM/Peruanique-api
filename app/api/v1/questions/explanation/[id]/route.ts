import { QuestionService } from '@/features/questions/services/question-services';
import { ApiResponse } from '@/shared/response/api-response';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = request.nextUrl?.pathname.split('/').pop();

    if (!id) {
      return ApiResponse.error('Question id is required', 422);
    }

    const question = await QuestionService.getQuestionById(id);

    if (!question) {
      return ApiResponse.error('Question not found', 404);
    }

    return ApiResponse.success({ id: question.id, explanation_text: question.explanation_text });
  } catch (error: unknown) {
    console.error('[ERROR_GET_QUESTION_EXPLANATION]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}
