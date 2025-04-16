import { NextResponse, type NextRequest } from "next/server";

import successResponse, { errorResponse } from "@/app/api/response";
import getSession from "@/lib/getSession";
import { ApiResponse, PaginatedData } from "@/types/api";
import { ProfilePagePostsFilter } from "@/types/constants";
import { PostWithCounts } from "@/types/post";
import { getProfilePosts } from "../../fetching";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<PaginatedData<PostWithCounts>>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = (searchParams.get("filter") as ProfilePagePostsFilter) || "posts";
    const cursor = searchParams.get("cursor") ?? undefined;

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
