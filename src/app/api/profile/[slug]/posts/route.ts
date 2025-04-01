import { type NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/getSession';
import { ApiResponse } from '@/types/api';
import { PostWithCounts } from '@/types/post';
import successResponse, { errorResponse } from '@/app/api/response';
import { getProfilePosts } from '../../fetching';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<PostWithCounts[]>>> {
  try {
    const { slug } = await params;
    const session = await getSession();

    const profilePosts = await getProfilePosts({
      profileId: slug,
      userProfileId: session.user.profile,
    });

    return NextResponse.json(successResponse(profilePosts));
  } catch (error) {
    return NextResponse.json(errorResponse(error));
  }
}
