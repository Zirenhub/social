import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';
import { postQuery } from '@/types/post';
import { profileQuery } from '@/types/profile';
import { getUser } from '@/lib/session';

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

export const getProfile = async (profileId: string) => {
  const user = await getUser();

  return unstable_cache(
    async () => {
      try {
        const profile = await prisma.profile.findUniqueOrThrow({
          where: {
            id: profileId,
          },
          ...profileQuery(user.profile.id),
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
      revalidate: 60,
    }
  )();
};

export const getProfilePosts = (profileId: string) => {
  return unstable_cache(
    async () => {
      try {
        const posts = await prisma.post.findMany(postQuery({ profileId }));
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
