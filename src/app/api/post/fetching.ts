import { prisma } from '@/lib/prisma';
import { HomePagePostsFilter } from '@/types/constants';
import { postQuery, PostWithCounts } from '@/types/post';
import { cache } from 'react';
import { errorResponse } from '../response';
import getSession from '@/lib/getSession';

export const getHomePosts = cache(
  async ({ filter }: { filter: HomePagePostsFilter }) => {
    try {
      const session = await getSession();
      let posts: PostWithCounts[] = [];
      if (filter === 'forYou') {
        const forYouPosts = await prisma.post.findMany({
          ...postQuery({ userProfileId: session.user.profile }),
        });
        posts = forYouPosts;
      }

      if (filter === 'following') {
        const profile = await prisma.profile.findUniqueOrThrow({
          where: { id: session.user.profile },
          include: {
            following: {
              include: {
                following: {
                  select: {
                    posts: postQuery({ userProfileId: session.user.profile }),
                  },
                },
              },
            },
          },
        });

        for (const following of profile.following) {
          posts.push(...following.following.posts);
        }
      }

      return posts;
    } catch (error) {
      const err = errorResponse(error, 'Failed getting home page posts.');
      throw new Error(err.error?.message);
    }
  }
);
