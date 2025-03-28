'use server';
import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { LogInZ, SignUpContent, SignUpZ } from '@/types/auth';
import { ACTIVITY_THRESHOLDS } from '@/types/constants';
const bcrypt = require('bcryptjs');
import successResponse, { errorResponse } from '../response';

let lastUpdateTimestamp = 0;

export async function signUp(formData: SignUpZ) {
  try {
    const parsed = SignUpContent.parse({
      ...formData,
      day: Number(formData.day),
      month: Number(formData.month),
      year: Number(formData.year),
      username: formData.username.toLowerCase(),
    });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(parsed.password, saltRounds);

    const dateOfBirth = new Date(parsed.year, parsed.month, parsed.day);

    // Save the user in the database
    const newUserWithProfile = await prisma.user.create({
      data: {
        email: parsed.email,
        hashedPassword,
        profile: {
          create: {
            username: parsed.username,
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            gender: parsed.gender,
            birthday: dateOfBirth,
          },
        },
      },
      include: {
        profile: true, // Include profile data in the response
      },
      omit: { hashedPassword: true },
    });

    // Sign in the user with NextAuth
    await signIn('credentials', {
      email: parsed.email,
      password: parsed.password,
      redirect: false,
    });

    return successResponse(newUserWithProfile);
  } catch (err) {
    return errorResponse(err, 'An error occurred while creating the user.');
  }
}

export async function login(formData: LogInZ) {
  try {
    await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    return successResponse(null);
  } catch (err) {
    return errorResponse(err, 'An error occurred while logging the user.');
  }
}

export async function updateLastActive(
  actionType: 'browse' | 'post' | 'like' | 'comment' = 'browse'
) {
  try {
    const now = Date.now();

    // Different minimum intervals based on action importance
    const minIntervals = {
      browse: ACTIVITY_THRESHOLDS.UPDATE_LAST_ACTIVE_MINUTES * 60 * 1000.0,
      comment: 30000, // 30 seconds
      like: 10000, // 10 seconds
      post: 0, // always update on post
    };

    // Check if we've updated too recently for this action type
    if (now - lastUpdateTimestamp < minIntervals[actionType]) {
      // Skip update but return success (silent throttling)
      return { success: true, data: { throttled: true }, error: null };
    }

    // Get the current user from the session
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        data: null,
        error: { message: 'User not authenticated' },
      };
    }

    // Update the profile's lastActive timestamp
    const updatedProfile = await prisma.profile.update({
      where: { id: session.user.profile },
      data: { lastActive: new Date() },
    });

    // Update our timestamp tracker
    lastUpdateTimestamp = now;

    return { success: true, data: updatedProfile, error: null };
  } catch (err) {
    console.error('Failed to update last active:', err);
    return {
      success: false,
      data: null,
      error: { message: 'An error occurred while updating last active prop.' },
    };
  }
}

export async function logOut() {
  try {
    await signOut();
    return successResponse(null);
  } catch (err) {
    return errorResponse(err, 'An error occurred while logging out.');
  }
}
