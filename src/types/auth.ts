import { z } from 'zod';

function getMinCharError(field: string, minChar: number) {
  return { message: `${field} must be ${minChar} or more characters long.` };
}

function getMaxCharError(field: string, maxChar: number) {
  return { message: `${field} must be no longer than ${maxChar} characters.` };
}

export const SignUpContent = z
  .object({
    username: z
      .string({ message: 'Username must be included.' })
      .trim()
      .min(3, getMinCharError('Username', 3))
      .max(14, getMaxCharError('Username', 14)),
    firstName: z
      .string({ message: 'First Name must be included.' })
      .trim()
      .min(3, getMinCharError('First Name', 3))
      .max(14, getMaxCharError('First Name', 14)),
    lastName: z
      .string({ message: 'Last Name must be included.' })
      .trim()
      .min(3, getMinCharError('Last Name', 3))
      .max(14, getMaxCharError('Last Name', 14)),
    day: z
      .number({ message: 'Invalid day.' })
      .min(1, 'Day is required')
      .max(31),
    month: z
      .number({ message: 'Invalid month.' })
      .min(0, 'Month is required')
      .max(11),
    year: z
      .number({ message: 'Invalid year.' })
      .min(1900, 'Year is required')
      .max(new Date().getFullYear()),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Invalid gender.' }),
    bio: z.string().trim().max(160, getMaxCharError('Bio', 160)).optional(),
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
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

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

type SignUpZ = z.infer<typeof SignUpContent>;
type LogInZ = z.infer<typeof LogInContent>;

export type { SignUpZ, LogInZ };
