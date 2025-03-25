import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS, HomePagePostsFilter } from '@/types/constants';
import { postQuery, PostWithCounts } from '@/types/post';
import { getUser } from '@/lib/session';
import { getProfile } from '../profile/fetching';

export const getHomePosts = async ({
  filter,
}: {
  filter: HomePagePostsFilter;
}) => {
  const user = await getUser();

  return unstable_cache(
    async () => {
      try {
        let posts: PostWithCounts[] = [];

        if (filter === 'forYou') {
          const forYouPosts = await prisma.post.findMany({ ...postQuery({}) });
          posts = forYouPosts;
        }

        if (filter === 'following') {
          const profile = await prisma.profile.findUniqueOrThrow({
            where: { id: user.profile.id },
            include: {
              following: {
                include: { following: { select: { posts: postQuery({}) } } },
              },
            },
          });

          for (const follower of profile.following) {
            posts.push(...follower.following.posts);
          }
        }
        return successResponse(posts);
      } catch (error) {
        return errorResponse(error, 'Something went wrong fetching posts.');
      }
    },
    [CACHE_TAGS.POSTS(filter)],
    { tags: [CACHE_TAGS.POSTS(filter)] }
  )();
};
