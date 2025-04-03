import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, HomePagePostsFilter } from '@/types/constants';
import { PaginatedPosts, postQuery } from '@/types/post';
import { errorResponse } from '../response';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import paginationParams from '@/helpers/paginationParams';

// Constants for pagination

type GetHomePostsOptions = {
  filter: HomePagePostsFilter;
  userProfileId: string;
  page?: number;
  perPage?: number;
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
      return await getForYouPosts(userProfileId, skip, take);
    }

    if (filter === 'following') {
      return await getFollowingPosts(userProfileId, skip, take);
    }

    throw new Error('Invalid filter type');
  } catch (error) {
    const err = errorResponse(error, 'Failed getting home page posts.');
    throw new Error(err.error.message);
  }
};

async function getForYouPosts(profileId: string, skip: number, take: number) {
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

async function getFollowingPosts(
  profileId: string,
  skip: number,
  take: number
) {
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
