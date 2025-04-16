import { NextResponse, type NextRequest } from "next/server";

import getSession from "@/lib/getSession";
import { ApiResponse } from "@/types/api";
import { GetProfileType } from "@/types/profile";
import successResponse, { errorResponse } from "../../response";
import { getProfile } from "../fetching";

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
