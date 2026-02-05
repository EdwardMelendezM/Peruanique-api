import { UpdateRoadmapNodeSchema } from '@/features/roadmap-nodes/dtos/update-roadmap-node.dto';
import { ApiResponse } from '@/shared/response/api-response';
import { RoadmapNodeService } from '@/features/roadmap-nodes/services/roadmap-node-services';
import { isPrismaError } from '@/shared/utils/error-handler';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const node = await RoadmapNodeService.getRoadmapNodeWithQuestions(id);

    if (!node) return ApiResponse.error('Not Found', 404);

    return ApiResponse.success(node);
  } catch (error: unknown) {
    console.error('[ERROR_GET_ROADMAP_NODE]:', error);
    const isDev = process.env.NODE_ENV === 'development';
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(isDev ? message : 'Internal Server Error', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const result = UpdateRoadmapNodeSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse.error('Validation Failed', 422, result.error.flatten().fieldErrors);
    }

    const updated = await RoadmapNodeService.updateRoadmapNode(id, result.data);

    return ApiResponse.success(updated);
  } catch (error: unknown) {
    console.error('[ERROR_UPDATE_ROADMAP_NODE]:', error);

    if (isPrismaError(error)) {
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await RoadmapNodeService.deleteRoadmapNode(id);

    return ApiResponse.success({}, 204);
  } catch (error: unknown) {
    console.error('[ERROR_DELETE_ROADMAP_NODE]:', error);

    if (isPrismaError(error)) {
      return ApiResponse.error('Cannot delete node', 400);
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return ApiResponse.error(
      process.env.NODE_ENV === 'development' ? message : 'Internal Server Error',
      500
    );
  }
}
