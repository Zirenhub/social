'use server';
import { prisma } from '@/lib/prisma';
import { errorResponse } from '../response';
import { GetUserType } from '@/types/auth';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';

export const GetUser = async (userId: string): Promise<GetUserType> => {
  'use cache';
  cacheTag(CACHE_TAGS.USER(userId));
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: { profile: true },
    });
    if (!user || !user.profile) {
      throw new Error('Failed to find user');
    }
    const { hashedPassword, profile, ...safeUser } = user;

    return { ...safeUser, profile };
  } catch (error) {
    const err = errorResponse(error, 'Something went wrong getting user');
    throw new Error(err.error?.message);
  }
};
