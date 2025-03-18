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
