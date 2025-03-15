'use server';

import { LogInContent, LogInZ, SignUpContent, SignUpZ } from '@/types/auth';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { createSession, deleteSession, getUser } from '@/lib/session';
import { SessionUser } from '@/types/api';
import { revalidateTag } from 'next/cache';

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

    await createSession(newUserWithProfile as SessionUser);

    return successResponse(newUserWithProfile);
  } catch (err) {
    return errorResponse(err, 'An error occurred while creating the user.');
  }
}

export async function logIn(formData: LogInZ) {
  try {
    const parsed = LogInContent.parse(formData);

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.email,
      },
      include: {
        profile: true,
      },
    });

    if (!user || !user.profile) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(
      parsed.password,
      user.hashedPassword
    );

    if (!passwordMatch) {
      throw new Error('Password is incorrect');
    }

    const { hashedPassword, ...safeUser } = user;

    await createSession(safeUser as SessionUser);

    return successResponse(safeUser);
  } catch (err) {
    return errorResponse(err, 'An error occurred while creating the user.');
  }
}

export async function updateLastActive() {
  try {
    // Get the current user from the session
    const user = await getUser();

    // Update the profile's lastActive timestamp
    const updatedProfile = await prisma.profile.update({
      where: { id: user.profile.id },
      data: { lastActive: new Date() },
      include: { user: true },
    });

    // Remove sensitive data before storing in session
    const { hashedPassword, ...safeUser } = updatedProfile.user;

    // Update the session with new lastActive time
    await createSession({ ...safeUser, profile: updatedProfile });

    // Revalidate any cached data that depends on the profile
    revalidateTag(`profile-${updatedProfile.id}`);

    return successResponse({ ...safeUser, profile: updatedProfile });
  } catch (err) {
    console.error('Failed to update last active:', err);
    return errorResponse(
      err,
      'An error occurred while updating last active prop.'
    );
  }
}

export async function logOut() {
  try {
    await deleteSession();
    return successResponse(null);
  } catch (err) {
    return errorResponse(err, 'An error occurred while logging out.');
  }
}
