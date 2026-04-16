import { ApiResponse } from '@/shared/response/api-response';
import { GenerateInsightSchema } from '@/features/insight/dtos/generate-insight.dto';
import { InsightService } from '@/features/insight/services/insight-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GenerateInsightSchema.safeParse(body);
    if (!parsed.success) return ApiResponse.error('Validation Failed', 422, parsed.error.flatten().fieldErrors);

    const result = await InsightService.generateInsight(parsed.data);

    return ApiResponse.success(result, 200);
  } catch (error: unknown) {
    console.error('[ERROR_GENERATE_INSIGHT]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}

