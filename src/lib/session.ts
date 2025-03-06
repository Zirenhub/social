'use server-only';

import { SessionUser } from '@/types/api';
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
    return payload;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Failed to decrypt session', error.message);
    }

    console.log('Failed to verify session');
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
