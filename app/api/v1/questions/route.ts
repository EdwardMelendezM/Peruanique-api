import { CreateQuestionSchema } from '@/features/questions/dtos/create-question.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { QuestionService } from '@/features/questions/services/question-services';
import { isPrismaError } from '@/shared/utils/error-handler';
import { NextRequest } from 'next/server';
import { parseQueryParams } from '@/shared/utils/query-parser';
import { PaginationSchema } from '@/shared/dtos/pagination.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateQuestionSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const newQuestion = await QuestionService.createQuestion(result.data);

    return ApiResponse.success(newQuestion, 201);
  } catch (error: unknown) {
    console.error('[ERROR_CREATE_QUESTION]:', error);

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

export async function GET(request: NextRequest) {
  try {
    const rawParams = parseQueryParams(request.url);
    const nodeId = rawParams.nodeId as string | undefined;

    const result = PaginationSchema.safeParse(rawParams);

    if (!result.success) {
      return ApiResponse.error('Invalid query parameters', 422, result.error.flatten().fieldErrors);
    }

    const query: PaginationDTO & { nodeId?: string } = { ...result.data, nodeId };

    const { data, meta } = await QuestionService.getAllQuestions(query);

    return ApiResponse.success({ items: data, meta });
  } catch (error: unknown) {
    console.error('[ERROR_GET_QUESTIONS]:', error);

    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}
