import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { LAST_ACTIVE_THRESHOLD_S } from './types/constants';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();
  const cookieStore = await cookies();
  const encryptedPayload = cookieStore.get('session')?.value;

  // Parse the session if it exists
  const session = encryptedPayload ? await decrypt(encryptedPayload) : null;

  // Case 1: Unauthenticated user trying to access any path except "/"
  if (session === null && pathname !== '/') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Check if more than (n) minutes have passed from lastActive
  if (session) {
    const lastActive = new Date(session.user.profile.lastActive).getTime();
    const currentTime = Date.now();

    const newHeaders = new Headers(req.headers);
    if (currentTime - lastActive > LAST_ACTIVE_THRESHOLD_S * 1000) {
      // Add a custom header to trigger lastActive update in a subsequent API route
      newHeaders.set('x-update-last-active', 'true');
    } else {
      newHeaders.set('x-update-last-active', 'false');
    }
    NextResponse.next({ request: { headers: newHeaders } });
  }

  // Case 2: Authenticated user trying to access root path "/"
  if (session && pathname === '/') {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  if (pathname === '/logout') {
    // Clear the session cookie
    url.pathname = '/';
    cookieStore.delete('session');
    return NextResponse.redirect(url);
  }

  // Case 3: Authenticated user trying to access path "/profile", redirect to own profile
  if (session && pathname === '/profile') {
    url.pathname = `/profile/${session.user.profile.id}`;
    return NextResponse.redirect(url);
  }

  // If none of the redirect conditions are met, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|public|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)',
  ],
};
