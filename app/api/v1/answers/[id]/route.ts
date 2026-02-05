import { UpdateAnswerSchema } from '@/features/answers/dtos/update-answer.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { AnswerService } from '@/features/answers/services/answer-services';
import { isPrismaError } from '@/shared/utils/error-handler';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const answer = await AnswerService.getAnswerById(id);

    if (!answer) return ApiResponse.error('Not Found', 404);

    return ApiResponse.success(answer);
  } catch (error: unknown) {
    console.error('[ERROR_GET_ANSWER]:', error);
    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const result = UpdateAnswerSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const updated = await AnswerService.updateAnswer(id, result.data);

    return ApiResponse.success(updated);
  } catch (error: unknown) {
    console.error('[ERROR_UPDATE_ANSWER]:', error);

    if (isPrismaError(error)) {
      if (error.code === 'P2002') {
        return ApiResponse.error('Answer conflict', 409);
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
    await AnswerService.deleteAnswer(id);

    return ApiResponse.success({}, 204);
  } catch (error: unknown) {
    console.error('[ERROR_DELETE_ANSWER]:', error);

    if (isPrismaError(error)) {
      return ApiResponse.error('Cannot delete answer', 400);
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}
