'use server';

import { SignUpContent, SignUpZ } from '@/types/auth';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { createSession } from '@/lib/session';

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

    await createSession(newUserWithProfile);

    return successResponse(newUserWithProfile);
  } catch (err) {
    return errorResponse(err, 'An error occurred while creating the user.');
  }
}
