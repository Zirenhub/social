'use server';

import { LogInContent, LogInZ, SignUpContent, SignUpZ } from '@/types/auth';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { createSession, deleteSession } from '@/lib/session';
import { SessionUser } from '@/types/api';

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

    if (!user) {
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

    return successResponse(user);
  } catch (err) {
    return errorResponse(err, 'An error occurred while creating the user.');
  }
}

export async function logOut() {
  await deleteSession();
  return successResponse(null);
}
