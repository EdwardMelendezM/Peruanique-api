import { UserService } from '@/features/users/services/user-services';
import { ApiResponse } from '@/shared/response/api-response';

export async function GET() {
  try {
    const users = await UserService.getDisabledUsers();
    return ApiResponse.success(users, 200);
  } catch (error: unknown) {
    console.error('[ERROR_GET_DISABLED_USERS]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}

