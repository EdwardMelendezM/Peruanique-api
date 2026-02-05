import { CreateAnswerSchema } from '@/features/answers/dtos/create-answer.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { AnswerService } from '@/features/answers/services/answer-services';
import { isPrismaError } from '@/shared/utils/error-handler';
import { NextRequest } from 'next/server';
import { parseQueryParams } from '@/shared/utils/query-parser';
import { PaginationSchema } from '@/shared/dtos/pagination.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateAnswerSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const newAnswer = await AnswerService.createAnswer(result.data);

    return ApiResponse.success(newAnswer, 201);
  } catch (error: unknown) {
    console.error('[ERROR_CREATE_ANSWER]:', error);

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

export async function GET(request: NextRequest) {
  try {
    const rawParams = parseQueryParams(request.url);
    const questionId = rawParams.questionId as string | undefined;

    const result = PaginationSchema.safeParse(rawParams);

    if (!result.success) {
      return ApiResponse.error('Invalid query parameters', 422, result.error.flatten().fieldErrors);
    }

    const query: PaginationDTO & { questionId?: string } = { ...result.data, questionId };

    const { data, meta } = await AnswerService.getAllAnswers(query);

    return ApiResponse.success({ items: data, meta });
  } catch (error: unknown) {
    console.error('[ERROR_GET_ANSWERS]:', error);

    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}
