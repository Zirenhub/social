import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';

export const getPosts = unstable_cache(
  async () => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          profile: true,
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return successResponse(posts);
    } catch (error) {
      return errorResponse(error, 'Something went wrong fetching posts.');
    }
  },
  ['posts'], // dynamic tag
  { tags: ['posts'], revalidate: false } // overall root tag
);
