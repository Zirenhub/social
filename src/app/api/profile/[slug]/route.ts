import { type NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/getSession';
import { ApiResponse } from '@/types/api';
import successResponse, { errorResponse } from '../../response';
import { getProfile } from '../fetching';
import { GetProfileType } from '@/types/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<GetProfileType>>> {
  try {
    const { slug } = await params;
    const session = await getSession();

    const profile = await getProfile({
      profileId: slug,
      userProfileId: session.user.profile,
    });

    return NextResponse.json(successResponse(profile));
  } catch (error) {
    return NextResponse.json(errorResponse(error));
  }
}
