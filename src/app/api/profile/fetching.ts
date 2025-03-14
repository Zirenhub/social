import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';
import { LAST_ACTIVE_THRESHOLD_S } from '@/types/constants';

export const getPostsCount = unstable_cache(
  async (profileId: string) => {
    try {
      const count = await prisma.post.count({
        where: {
          profileId: profileId,
        },
      });

      return successResponse(count);
    } catch (error) {
      return errorResponse(error, 'Failed getting profile posts count.');
    }
  },
  ['posts'],
  { tags: ['posts'], revalidate: false }
);

export const getProfile = (profileId: string) => {
  // Create a profile-specific cache key
  const cacheKey = `profile-${profileId}`;

  return unstable_cache(
    async () => {
      try {
        const profile = await prisma.profile.findUniqueOrThrow({
          where: {
            id: profileId,
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
      revalidate: LAST_ACTIVE_THRESHOLD_S,
    }
  )();
};
