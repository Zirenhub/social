import { type NextRequest, NextResponse } from 'next/server';
import { getHomePosts } from '@/app/api/posts/fetching';
import getSession from '@/lib/getSession';
import { HomePagePostsFilter, PER_PAGE } from '@/types/constants';
import { ApiResponse } from '@/types/api';
import { PaginatedPosts } from '@/types/post';
import successResponse, { errorResponse } from '../response';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedPosts>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter =
      (searchParams.get('filter') as HomePagePostsFilter) || 'forYou';
    const page = Number.parseInt(searchParams.get('page') || '1', 10);

    const session = await getSession();

    const paginatedPosts = await getHomePosts({
      filter,
      userProfileId: session.user.profile,
      perPage: PER_PAGE,
      page,
    });

    return NextResponse.json(successResponse(paginatedPosts));
  } catch (error) {
    return NextResponse.json(errorResponse(error));
  }
}
