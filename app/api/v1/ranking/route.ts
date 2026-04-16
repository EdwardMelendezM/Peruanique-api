import { NextRequest } from 'next/server';
import { ApiResponse } from '@/shared/response/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.min(100, Number(limitParam)) : 20;

    // simple ranking by total_xp desc
    const users = await prisma.user.findMany({
      orderBy: { total_xp: 'desc' },
      take: limit,
      select: { id: true, email: true, full_name: true, total_xp: true }
    });

    // annotate with position
    const items = users.map((u, idx) => ({ position: idx + 1, ...u }));

    return ApiResponse.success({ items }, 200);
  } catch (error: unknown) {
    console.error('[ERROR_GET_RANKING]:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return ApiResponse.error(process.env.NODE_ENV === 'development' ? message : 'Internal Server Error', 500);
  }
}

