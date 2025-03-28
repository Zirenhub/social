import { prisma } from '@/lib/prisma';
import { errorResponse } from '../response';
import { postQuery } from '@/types/post';
import { profileQuery } from '@/types/profile';
import { cache } from 'react';
import getSession from '@/lib/getSession';

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

export const getProfile = cache(
  async ({ profileId }: { profileId: string }) => {
    const session = await getSession();

    try {
      const profile = await prisma.profile.findUniqueOrThrow({
        where: {
          id: profileId,
        },
        ...profileQuery(session.user.profile),
      });

      return profile;
    } catch (error) {
      const err = errorResponse(error, 'Failed getting profile.');
      throw new Error(err.error?.message);
    }
  }
);

export const getProfilePosts = cache(
  async ({ profileId }: { profileId: string }) => {
    const session = await getSession();

    try {
      const posts = await prisma.post.findMany(
        postQuery({ profileId, userProfileId: session.user.profile })
      );
      return posts;
    } catch (error) {
      const err = errorResponse(error, 'Failed getting profile posts.');
      throw new Error(err.error?.message);
    }
  }
);

// Get fresh lastActive separately
export const getProfileLastActive = async (profileId: string) => {
  const result = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { lastActive: true },
  });
  return result?.lastActive;
};
