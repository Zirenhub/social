'use server';
import ClientLayout from './ClientLayout';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import React from 'react';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const encryptedPayload = cookieStore.get('session')?.value;
  const session = encryptedPayload ? await decrypt(encryptedPayload) : null;

  if (!session) {
    throw new Error('No session found in app layout');
  }

  return <ClientLayout user={session.user}>{children}</ClientLayout>;
}
