import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';

export const getPostsCount = async (profileId: string) => {
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
};
