import { UpdateQuestionSchema } from '@/features/questions/dtos/update-question.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { QuestionService } from '@/features/questions/services/question-services';
import { isPrismaError } from '@/shared/utils/error-handler';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const question = await QuestionService.getQuestionWithAnswers(id);

    if (!question) return ApiResponse.error('Not Found', 404);

    return ApiResponse.success(question);
  } catch (error: unknown) {
    console.error('[ERROR_GET_QUESTION]:', error);
    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const result = UpdateQuestionSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const updated = await QuestionService.updateQuestion(id, result.data);

    return ApiResponse.success(updated);
  } catch (error: unknown) {
    console.error('[ERROR_UPDATE_QUESTION]:', error);

    if (isPrismaError(error)) {
      if (error.code === 'P2002') {
        return ApiResponse.error('Question conflict', 409);
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
    await QuestionService.deleteQuestion(id);

    return ApiResponse.success({}, 204);
  } catch (error: unknown) {
    console.error('[ERROR_DELETE_QUESTION]:', error);

    if (isPrismaError(error)) {
      return ApiResponse.error('Cannot delete question', 400);
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}
