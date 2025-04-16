import { NextResponse, type NextRequest } from "next/server";
import NextAuth from "next-auth";

import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // Get the auth session
  const session = await auth();

  // Case 1: Unauthenticated user trying to access any path except "/"
  if (!session && pathname !== "/") {
    console.log("unauthorized:");
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Check if user is authenticated
  if (session) {
    console.log("authorized:");
    // Case 2: Authenticated user trying to access root path "/"
    if (pathname === "/") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }

    // Case 3: Authenticated user trying to access path "/profile", redirect to own profile
    if (pathname === "/profile") {
      // Access the profile ID from the session
      const profileId = session.user.profile;
      if (profileId) {
        url.pathname = `/profile/${profileId}`;
        return NextResponse.redirect(url);
      }
    }
  }

  console.log("Middleware pathname:", pathname);
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|public|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)"],
};
