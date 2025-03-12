import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';

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
