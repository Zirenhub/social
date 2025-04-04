import { type NextRequest, NextResponse } from 'next/server';
import { getHomePosts } from '@/app/api/posts/fetching';
import getSession from '@/lib/getSession';
import { type HomePagePostsFilter, PER_PAGE } from '@/types/constants';
import type { ApiResponse } from '@/types/api';
import type { PaginatedPosts } from '@/types/post';
import successResponse, { errorResponse } from '../response';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedPosts>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter =
      (searchParams.get('filter') as HomePagePostsFilter) || 'forYou';
    const cursor = searchParams.get('cursor') ?? undefined;

    const session = await getSession();

    const paginatedPosts = await getHomePosts({
      filter,
      userProfileId: session.user.profile,
      cursor,
    });

    return NextResponse.json(successResponse(paginatedPosts));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(errorResponse(error));
  }
}
