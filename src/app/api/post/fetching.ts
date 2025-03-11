import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';

export const getPosts = async (filter: string) => {
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
};
