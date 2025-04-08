import { type NextRequest, NextResponse } from 'next/server';
import { getHomePosts } from '@/app/api/posts/fetching';
import getSession from '@/lib/getSession';
import { type HomePagePostsFilter } from '@/types/constants';
import type { ApiResponse, PaginatedData } from '@/types/api';
import successResponse, { errorResponse } from '../response';
import { PostWithCounts } from '@/types/post';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedData<PostWithCounts>>>> {
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
