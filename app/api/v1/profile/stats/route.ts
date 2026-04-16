import { NextRequest } from 'next/server';
import { ApiResponse } from '@/shared/response/api-response';
import { UserService } from '@/features/users/services/user-services';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return ApiResponse.error('userId query parameter is required for now', 422);
    }

    const stats = await UserService.getProfileStats(userId);
    return ApiResponse.success(stats, 200);
  } catch (error: unknown) {
    console.error('[ERROR_GET_PROFILE_STATS]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}

