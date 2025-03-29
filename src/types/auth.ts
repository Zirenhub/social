import { getMaxCharError, getMinCharError } from '@/helpers/charLenghtError';
import { z } from 'zod';
import { BasicProfileContent } from './profile';
import { Profile } from '@prisma/client';

export const UserContent = z.object({
  email: z
    .string({ message: 'Email must be included.' })
    .trim()
    .max(32, { message: "Email address can't be longer than 32 characters" })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string({ message: 'Password must be included.' })
    .trim()
    .min(3, getMinCharError('Password', 3))
    .max(18, getMaxCharError('Password', 18)),
  confirmPassword: z.string({
    message: 'Confirm Password must be included.',
  }),
});

export const SignUpContent = UserContent.merge(BasicProfileContent).superRefine(
  ({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmPassword'],
      });
    }
  }
);

export const LogInContent = z.object({
  email: z
    .string({ message: 'Email must be included.' })
    .trim()
    .max(32, { message: "Email address can't be longer than 32 characters" })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string({ message: 'Password must be included.' })
    .trim()
    .min(3, getMinCharError('Password', 3))
    .max(18, getMaxCharError('Password', 18)),
});

type GetUserType = { email: string; id: string; profile: Profile };

type SignUpZ = z.infer<typeof SignUpContent>;
type LogInZ = z.infer<typeof LogInContent>;

export type { SignUpZ, LogInZ, GetUserType };
