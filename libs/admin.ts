import { ApiResponse } from '@/shared/response/api-response';

export function isAdminRequest(request: Request) {
  const header = request.headers.get('x-admin-secret') || request.headers.get('authorization')?.replace(/^Bearer\s+/, '');
  const secret = process.env.ADMIN_SECRET || process.env.BETTER_AUTH_SECRET; // fallback
  return !!header && secret && header === secret;
}

export function requireAdminOrThrow(request: Request) {
  if (!isAdminRequest(request)) {
    return ApiResponse.error('Unauthorized', 401);
  }
  return null;
}

