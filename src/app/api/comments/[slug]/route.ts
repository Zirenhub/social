import { type NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/getSession';
import type { ApiResponse, PaginatedData } from '@/types/api';
import successResponse, { errorResponse } from '../../response';
import { CommentsFilter, CommentWithCounts } from '@/types/comment';
import { getComments } from '../fetching';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<PaginatedData<CommentWithCounts>>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = (searchParams.get('filter') as CommentsFilter) || 'newest';
    const cursor = searchParams.get('cursor') ?? undefined;

    const { slug } = await params;
    const session = await getSession();

    const comments = await getComments({
      filter,
      postId: slug,
      userProfileId: session.user.profile,
      cursor,
    });

    return NextResponse.json(successResponse(comments));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(errorResponse(error));
  }
}
