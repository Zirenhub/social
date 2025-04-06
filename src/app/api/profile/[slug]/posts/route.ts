import { type NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/getSession';
import { ApiResponse } from '@/types/api';
import { PaginatedPosts } from '@/types/post';
import successResponse, { errorResponse } from '@/app/api/response';
import { getProfilePosts } from '../../fetching';
import { PER_PAGE, ProfilePagePostsFilter } from '@/types/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<PaginatedPosts>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter =
      (searchParams.get('filter') as ProfilePagePostsFilter) || 'posts';
    const cursor = searchParams.get('cursor') ?? undefined;

    const { slug } = await params;
    const session = await getSession();

    const profilePosts = await getProfilePosts({
      filter,
      profileId: slug,
      userProfileId: session.user.profile,
      cursor,
    });

    return NextResponse.json(successResponse(profilePosts));
  } catch (error) {
    return NextResponse.json(errorResponse(error));
  }
}
