'use server';
import {
  AdditinalProfileInfoContent,
  AdditinalProfileInfoZ,
} from '@/types/profile';
import successResponse, { errorResponse } from '../response';
import { prisma } from '@/lib/prisma';
import getSession from '@/lib/getSession';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';

export async function updateProfile(updatedData: AdditinalProfileInfoZ) {
  try {
    const parsed = AdditinalProfileInfoContent.parse(updatedData);
    const session = await getSession();
    const updatedProfile = await prisma.profile.update({
      where: { id: session.user.profile },
      data: parsed,
    });

    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile));

    return successResponse(updatedProfile);
  } catch (error) {
    return errorResponse(error, 'Something went wrong updating profile.');
  }
}

export async function followProfile(profileId: string) {
  try {
    const session = await getSession();
    if (session.user.profile === profileId) {
      throw new Error('You cannot follow yourself.');
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error('Profile not found.');
    }

    const result = await prisma.follow.create({
      data: {
        followerId: session.user.profile,
        followingId: profileId,
      },
    });

    revalidateTag(CACHE_TAGS.PROFILE(profileId)); // revalidate since followers count has changed
    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile)); // revalidate since following count has changed

    return successResponse(result);
  } catch (error) {
    return errorResponse(error, 'Something went wrong following profile.');
  }
}

export async function unfollowProfile(profileId: string) {
  try {
    const session = await getSession();
    if (session.user.profile === profileId) {
      throw new Error('You cannot unfollow yourself.');
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error('Profile not found.');
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.profile,
          followingId: profileId,
        },
      },
    });

    revalidateTag(CACHE_TAGS.PROFILE(profileId)); // revalidate since followers count has changed
    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile)); // revalidate since following count has changed

    return successResponse(null);
  } catch (error) {
    return errorResponse(error, 'Something went wrong unfollowing profile.');
  }
}
