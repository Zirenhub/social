import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';
import { postQuery } from '@/types/post';

type getPostsProps = {
  filter: string;
};

export const getHomePosts = ({ filter }: getPostsProps) => {
  return unstable_cache(
    async () => {
      try {
        const posts = await prisma.post.findMany(postQuery({}));
        return successResponse(posts);
      } catch (error) {
        return errorResponse(error, 'Something went wrong fetching posts.');
      }
    },
    [CACHE_TAGS.POSTS],
    { tags: [CACHE_TAGS.POSTS] }
  )();
};
