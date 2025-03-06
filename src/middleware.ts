import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();
  const cookieStore = await cookies();
  const encryptedPayload = cookieStore.get('session')?.value;

  // Parse the session if it exists
  const session = encryptedPayload ? await decrypt(encryptedPayload) : null;

  // Case 1: Authenticated user trying to access root path "/"
  if (session && pathname === '/') {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  // Case 2: Unauthenticated user trying to access any path except "/"
  if (!session && pathname !== '/') {
    url.pathname = '/';
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
