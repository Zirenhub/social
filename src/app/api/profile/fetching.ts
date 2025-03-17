import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';
import { Prisma } from '@prisma/client';

export const getPostsCount = (profileId: string, since?: Date) => {
  return unstable_cache(
    async () => {
      try {
        const query: Prisma.PostCountArgs = { where: { profileId } };
        if (since) {
          query.where = { ...query.where, createdAt: { gte: since } };
        }

        const count = await prisma.post.count(query);

        return successResponse(count);
      } catch (error) {
        return errorResponse(error, 'Failed getting profile posts count.');
      }
    },
    [CACHE_TAGS.PROFILE_POSTSCOUNT(profileId)],
    { tags: [CACHE_TAGS.PROFILE_POSTSCOUNT(profileId)] }
  )();
};

export const getProfileBasic = (profileId: string) => {
  // Create a profile-specific cache key
  const cacheKey = CACHE_TAGS.PROFILE(profileId);

  return unstable_cache(
    async () => {
      try {
        const profile = await prisma.profile.findUniqueOrThrow({
          where: {
            id: profileId,
          },
          select: {
            createdAt: true,
            location: true,
            bio: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        });
        return successResponse(profile);
      } catch (error) {
        return errorResponse(error, 'Failed getting profile.');
      }
    },
    // Use string array for cache key
    [cacheKey],
    {
      // Use string array for tags
      tags: [cacheKey, 'profile'],
    }
  )();
};

// Get fresh lastActive separately
export const getProfileLastActive = async (profileId: string) => {
  const result = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { lastActive: true },
  });
  return result?.lastActive;
};
