import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, HomePagePostsFilter, PER_PAGE } from '@/types/constants';
import { PaginatedPosts, postQuery } from '@/types/post';
import { errorResponse } from '../response';
import { unstable_cacheTag as cacheTag } from 'next/cache';

// Constants for pagination
const MAX_POSTS_PER_PAGE = 50;

type GetHomePostsOptions = {
  filter: HomePagePostsFilter;
  userProfileId: string;
  page?: number;
  perPage?: number;
};

export const getHomePosts = async ({
  filter,
  userProfileId,
  page = 1,
  perPage = PER_PAGE,
}: GetHomePostsOptions): Promise<PaginatedPosts> => {
  'use cache';
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.HOME_POSTS(filter));
  try {
    // Validate pagination parameters
    const validatedPerPage = Math.min(Math.max(1, perPage), MAX_POSTS_PER_PAGE);
    const validatedPage = Math.max(1, page);

    const skip = (validatedPage - 1) * validatedPerPage;
    const take = validatedPerPage;

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
// Helper function for "For You" posts
async function getForYouPosts(profileId: string, skip: number, take: number) {
  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      ...postQuery({ userProfileId: profileId }),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    hasMore: skip + take < totalCount,
  };
}

// Helper function for "Following" posts
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
      orderBy: { createdAt: 'desc' },
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
