import { CreateRoadmapNodeSchema } from '@/features/roadmap-nodes/dtos/create-roadmap-node.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { RoadmapNodeService } from '@/features/roadmap-nodes/services/roadmap-node-services';
import { isPrismaError } from '@/shared/utils/error-handler';
import { NextRequest } from 'next/server';
import { parseQueryParams } from '@/shared/utils/query-parser';
import { PaginationSchema } from '@/shared/dtos/pagination.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateRoadmapNodeSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const newNode = await RoadmapNodeService.createRoadmapNode(result.data);

    return ApiResponse.success(newNode, 201);
  } catch (error: unknown) {
    console.error('[ERROR_CREATE_ROADMAP_NODE]:', error);

    if (isPrismaError(error)) {
      // Handle unique constraint on courseId + order_index
      if (error.code === 'P2002') {
        return ApiResponse.error('Node order conflict in course', 409);
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
    // allow courseId as a query param as well
    const courseId = rawParams.courseId as string | undefined;

    const result = PaginationSchema.safeParse(rawParams);

    if (!result.success) {
      return ApiResponse.error('Invalid query parameters', 422, result.error.flatten().fieldErrors);
    }

    // forward courseId to service if present
    const query: PaginationDTO & { courseId?: string } = { ...result.data, courseId };

    const { data, meta } = await RoadmapNodeService.getAllRoadmapNodes(query);

    return ApiResponse.success({ items: data, meta });
  } catch (error: unknown) {
    console.error('[ERROR_GET_ROADMAP_NODES]:', error);

    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}
