'use server';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const GetUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      include: { profile: true },
    });
    if (!user || !user.profile) {
      throw new Error('Failed to find user');
    }
    const { hashedPassword, profile, ...safeUser } = user;

    return { ...safeUser, profile };
  } catch (err) {
    throw err;
  }
});
