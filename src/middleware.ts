import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API } from './types/constants';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // Get the session from cookies
  const cookieStore = await cookies();
  const encryptedPayload = cookieStore.get('session')?.value;
  const session = encryptedPayload ? await decrypt(encryptedPayload) : null;

  // Case 1: Unauthenticated user trying to access any path except "/"
  if (session === null && pathname !== '/') {
    console.log('unauthorized:');
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Check if user is authenticated
  if (session) {
    console.log('authorized:');

    // Case 2: Authenticated user trying to access root path "/"
    if (pathname === '/') {
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }

    // Case 3: Authenticated user trying to access path "/profile", redirect to own profile
    if (pathname === '/profile') {
      url.pathname = `/profile/${session.user.profile.id}`;
      return NextResponse.redirect(url);
    }

    // Check if more than threshold seconds have passed from lastActive
    const lastActive = new Date(session.user.profile.lastActive).getTime();
    const currentTime = Date.now();
    const timeSinceLastActive = currentTime - lastActive;

    // Only set the update header if enough time has passed
    if (timeSinceLastActive > API.PROFILE.LAST_ACTIVE_THRESHOLD_S * 1000) {
      // This will trigger our client component to call the server action
      const response = NextResponse.next();
      response.headers.set('x-update-last-active', 'true');
      return response;
    }
  }

  console.log('Middleware pathname:', pathname);

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|public|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)',
  ],
};
