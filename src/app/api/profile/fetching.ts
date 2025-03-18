import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';
import { postQuery } from '@/types/post';

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

export const getProfile = (profileId: string) => {
  return unstable_cache(
    async () => {
      try {
        const profile = await prisma.profile.findUniqueOrThrow({
          where: {
            id: profileId,
          },
          include: {
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
          },
          omit: { lastActive: true },
        });
        return successResponse(profile);
      } catch (error) {
        return errorResponse(error, 'Failed getting profile.');
      }
    },
    // Use string array for cache key
    [CACHE_TAGS.PROFILE(profileId)],
    {
      // Use string array for tags
      tags: [CACHE_TAGS.PROFILE(profileId)],
    }
  )();
};

export const getProfilePosts = (profileId: string) => {
  return unstable_cache(
    async () => {
      try {
        const posts = await prisma.post.findMany(postQuery(profileId));
        return successResponse(posts);
      } catch (error) {
        return errorResponse(error, 'Failed getting profile posts.');
      }
    },
    // Use string array for cache key
    [CACHE_TAGS.PROFILE_POSTS(profileId)],
    {
      // Use string array for tags
      tags: [
        CACHE_TAGS.PROFILE_POSTS(profileId),
        CACHE_TAGS.PROFILE(profileId),
      ],
    }
  )();
};

// Get fresh lastActive separately
export const getProfileLastActive = async (profileId: string) => {
  const result = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { lastActive: true },
  });
  return result?.lastActive;
};
