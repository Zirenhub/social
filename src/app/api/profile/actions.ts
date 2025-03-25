'use server';

import {
  AdditinalProfileInfoContent,
  AdditinalProfileInfoZ,
} from '@/types/profile';
import successResponse, { errorResponse } from '../response';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';

export async function updateProfile(updatedData: AdditinalProfileInfoZ) {
  try {
    const parsed = AdditinalProfileInfoContent.parse(updatedData);
    const user = await getUser();
    const updatedProfile = await prisma.profile.update({
      where: { id: user.profile.id },
      data: parsed,
    });

    revalidateTag(CACHE_TAGS.PROFILE(user.profile.id));

    return successResponse(updatedProfile);
  } catch (error) {
    return errorResponse(error, 'Something went wrong updating profile.');
  }
}

export async function followProfile(profileId: string) {
  try {
    const user = await getUser();
    if (user.profile.id === profileId) {
      return errorResponse(null, 'You cannot follow yourself.');
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return errorResponse(null, 'Profile not found.');
    }

    await prisma.follow.create({
      data: {
        followerId: user.profile.id,
        followingId: profileId,
      },
    });

    revalidateTag(CACHE_TAGS.PROFILE(profileId)); // revalidate since followers count has changed
    revalidateTag(CACHE_TAGS.PROFILE(user.profile.id)); // revalidate since following count has changed
    revalidateTag(CACHE_TAGS.POSTS('following')); // revalidate since we wanna show posts from the newly followed profile

    return successResponse(null);
  } catch (error) {
    return errorResponse(error, 'Something went wrong following profile.');
  }
}
// CAHNGE CACHE POSTS TO FOLLOWING FILTER!!
export async function unfollowProfile(profileId: string) {
  try {
    const user = await getUser();
    if (user.profile.id === profileId) {
      return errorResponse(null, 'You cannot unfollow yourself.');
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return errorResponse(null, 'Profile not found.');
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.profile.id,
          followingId: profileId,
        },
      },
    });

    revalidateTag(CACHE_TAGS.PROFILE(profileId)); // revalidate since followers count has changed
    revalidateTag(CACHE_TAGS.PROFILE(user.profile.id)); // revalidate since following count has changed
    revalidateTag(CACHE_TAGS.POSTS('following')); // revalidate since we wanna show posts from the newly followed profile

    return successResponse(null);
  } catch (error) {
    return errorResponse(error, 'Something went wrong unfollowing profile.');
  }
}
