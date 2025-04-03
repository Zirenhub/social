import { prisma } from '@/lib/prisma';
import { errorResponse } from '../response';
import { postQuery } from '@/types/post';
import { profileQuery } from '@/types/profile';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { CACHE_TAGS, ProfilePagePostsFilter } from '@/types/constants';
import { subDays } from 'date-fns';
import paginationParams from '@/helpers/paginationParams';

// export const getPostsCount = (profileId: string, since?: Date) => {
//   return unstable_cache(
//     async () => {
//       try {
//         const query: Prisma.PostCountArgs = { where: { profileId } };
//         if (since) {
//           query.where = { ...query.where, createdAt: { gte: since } };
//         }

//         const count = await prisma.post.count(query);

//         return successResponse(count);
//       } catch (error) {
//         return errorResponse(error, 'Failed getting profile posts count.');
//       }
//     },
//     [CACHE_TAGS.PROFILE_POSTSCOUNT(profileId)],
//     { tags: [CACHE_TAGS.PROFILE_POSTSCOUNT(profileId)] }
//   )();
// };

// export const getFollowingCount = (profileId: string) => {
//   return unstable_cache(
//     async () => {
//       try {
//         const {
//           _count: { following: count },
//         } = await prisma.profile.findUniqueOrThrow({
//           where: { id: profileId },
//           select: {
//             _count: { select: { following: true } },
//           },
//         });

//         return successResponse(count);
//       } catch (error) {
//         return errorResponse(error, 'Failed getting profile following count.');
//       }
//     },
//     [CACHE_TAGS.PROFILE_FOLLOWINGCOUNT(profileId)],
//     { tags: [CACHE_TAGS.PROFILE_FOLLOWINGCOUNT(profileId)] }
//   )();
// };

// export const getFollowersCount = (profileId: string) => {
//   return unstable_cache(
//     async () => {
//       try {
//         const {
//           _count: { followers: count },
//         } = await prisma.profile.findUniqueOrThrow({
//           where: { id: profileId },
//           select: {
//             _count: { select: { followers: true } },
//           },
//         });

//         return successResponse(count);
//       } catch (error) {
//         return errorResponse(error, 'Failed getting profile followers count.');
//       }
//     },
//     [CACHE_TAGS.PROFILE_FOLLOWINGCOUNT(profileId)],
//     { tags: [CACHE_TAGS.PROFILE_FOLLOWINGCOUNT(profileId)] }
//   )();
// };

type GetProfileProps = {
  profileId: string;
  userProfileId: string;
};

type GetProfilePostsProps = {
  profileId: string;
  filter: ProfilePagePostsFilter;
  userProfileId: string;
  page?: number;
  perPage?: number;
};

export const getProfile = async ({
  profileId,
  userProfileId,
}: GetProfileProps) => {
  'use cache';
  cacheTag(CACHE_TAGS.PROFILE(profileId));
  try {
    const profile = await prisma.profile.findUniqueOrThrow({
      where: {
        id: profileId,
      },
      ...profileQuery(userProfileId),
    });
    return profile;
  } catch (error) {
    const err = errorResponse(error, 'Failed getting profile.');
    throw new Error(err.error.message);
  }
};

export const getProfilePosts = async ({
  profileId,
  userProfileId,
  page,
  perPage,
  filter,
}: GetProfilePostsProps) => {
  'use cache';
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.PROFILE_POSTS(profileId, filter));
  try {
    const { skip, take } = paginationParams(page, perPage);

    if (filter === 'posts') {
      const [posts, totalCount] = await prisma.$transaction([
        prisma.post.findMany({
          ...postQuery({ profileId, userProfileId }),
          skip,
          take,
        }),
        prisma.post.count({ where: { profileId } }),
      ]);

      return {
        posts,
        hasMore: skip + take < totalCount,
      };
    }

    throw new Error('Invalid filter type');
  } catch (error) {
    const err = errorResponse(error, 'Failed getting profile posts.');
    throw new Error(err.error.message);
  }
};

// Get fresh lastActive separately
export const getProfileLastActive = async (profileId: string) => {
  'use cache';
  cacheTag(CACHE_TAGS.PROFILE(profileId));
  try {
    const dateThreshold = subDays(new Date(), 30);

    const result = await prisma.profile.findUniqueOrThrow({
      where: { id: profileId },
      select: {
        lastActive: true,
        _count: {
          select: {
            followers: { where: { createdAt: { gte: dateThreshold } } },
            posts: { where: { createdAt: { gte: dateThreshold } } },
          },
        },
      },
    });

    return result;
  } catch (error) {
    const err = errorResponse(error, 'Failed getting profile activity.');
    throw new Error(err.error.message);
  }
};
