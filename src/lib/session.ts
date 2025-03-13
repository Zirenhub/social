'use server-only';

import { ApiResponse, SessionUser } from '@/types/api';
import { SessionPayload } from '@/types/session';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await encrypt({ user, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Failed to decrypt session', error.message);
    }
    return null; // Explicitly return null instead of undefined
  }
}

export async function getSession(): Promise<ApiResponse<SessionUser>> {
  try {
    const cookieStore = await cookies();
    const encryptedPayload = cookieStore.get('session')?.value;

    if (!encryptedPayload) {
      throw new Error('No session cookie found.');
    }

    const session = await decrypt(encryptedPayload);

    if (!session || !session.user) {
      throw new Error('Session is undefined.');
    }

    return { data: session.user, success: true, error: null };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: { message: 'Failed getting session.' },
    };
  }
}

export async function getUser() {
  const user = await getSession();

  if (!user.success || !user.data) {
    throw new Error(user.error.message);
  }

  return user.data;
}
