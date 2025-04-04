import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, HomePagePostsFilter } from '@/types/constants';
import { PaginatedPosts, postQuery } from '@/types/post';
import { errorResponse } from '../response';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import paginationParams from '@/helpers/paginationParams';
import { subDays } from 'date-fns';

// Constants for pagination

type GetHomePostsOptions = {
  filter: HomePagePostsFilter;
  userProfileId: string;
  page?: number;
  perPage?: number;
};

type filterProps = {
  profileId: string;
  skip: number;
  take: number;
};

export const getHomePosts = async ({
  filter,
  userProfileId,
  page,
  perPage,
}: GetHomePostsOptions): Promise<PaginatedPosts> => {
  'use cache';
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.HOME_POSTS(filter));
  try {
    const { skip, take } = paginationParams(page, perPage);

    if (filter === 'forYou') {
      return await getForYouPosts({ profileId: userProfileId, skip, take });
    }

    if (filter === 'following') {
      return await getFollowingPosts({ profileId: userProfileId, skip, take });
    }

    if (filter === 'trending') {
      return await getTrendingPosts({ profileId: userProfileId, skip, take });
    }

    throw new Error('Invalid filter type');
  } catch (error) {
    const err = errorResponse(error, 'Failed getting home page posts.');
    throw new Error(err.error.message);
  }
};

async function getForYouPosts({ profileId, skip, take }: filterProps) {
  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      ...postQuery({ userProfileId: profileId }),
      skip,
      take,
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    hasMore: skip + take < totalCount,
  };
}

async function getFollowingPosts({ profileId, skip, take }: filterProps) {
  const followingRelationships = await prisma.follow.findMany({
    where: { followerId: profileId },
    select: { followingId: true },
  });

  const followingIds = followingRelationships.map((rel) => rel.followingId);

  if (followingIds.length === 0) {
    return { posts: [], hasMore: false };
  }

  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      ...postQuery({ userProfileId: profileId }),
      where: { profileId: { in: followingIds } },
      skip,
      take,
    }),
    prisma.post.count({
      where: {
        profileId: { in: followingIds },
      },
    }),
  ]);

  return {
    posts,
    hasMore: skip + take < totalCount,
  };
}

async function getTrendingPosts({ profileId, skip, take }: filterProps) {
  const yesterday = subDays(new Date(), 1);

  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      ...postQuery({ userProfileId: profileId }),
      where: {
        createdAt: { gte: yesterday },
        likes: { some: {} },
      },
      skip,
      take,
    }),
    prisma.post.count({
      where: {
        createdAt: { gte: yesterday },
        likes: { some: {} },
      },
    }),
  ]);

  const orderedPosts = posts.sort((a, b) => a._count.likes - b._count.likes);

  return {
    posts: orderedPosts,
    hasMore: skip + take < totalCount,
  };
}
