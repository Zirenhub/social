import { NextRequest, NextResponse } from "next/server";

import { getSearchProfiles } from "@/app/api/search/fetching";
import successResponse, { errorResponse } from "../response";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json([]);

  try {
    const results = await getSearchProfiles(query);
    return NextResponse.json(successResponse(results));
  } catch (error) {
    return NextResponse.json(errorResponse(error));
  }
}
