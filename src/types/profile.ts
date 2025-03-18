import { getMaxCharError, getMinCharError } from '@/helpers/charLenghtError';
import type { Profile } from '@prisma/client';
import { z } from 'zod';

export const BasicProfileContent = z.object({
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
  day: z.number({ message: 'Invalid day.' }).min(1, 'Day is required').max(31),
  month: z
    .number({ message: 'Invalid month.' })
    .min(0, 'Month is required')
    .max(11),
  year: z
    .number({ message: 'Invalid year.' })
    .min(1900, 'Year is required')
    .max(new Date().getFullYear()),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Invalid gender.' }),
});

const mbToBytes = (mb: number) => mb * 1024 * 1024;

export const MAX_BIO_CHARS = 160;
export const MAX_LOCATION_CHARS = 25;
const MAX_IMAGE_FILE_SIZE_MB = 2;
const MAX_IMAGE_FILE_SIZE_BYTES = mbToBytes(MAX_IMAGE_FILE_SIZE_MB);

export const ImageFileSchema = z
  .custom<File>()
  .refine((file) => file instanceof File && file.size > 0, {
    message: 'File is required.',
  })
  .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
    message: 'Only JPEG and PNG images are supported.',
  })
  .refine((file) => file.size <= MAX_IMAGE_FILE_SIZE_BYTES, {
    message: `File size must be less than ${MAX_IMAGE_FILE_SIZE_MB}MB.`,
  });

export const AdditinalProfileInfoContent = z.object({
  bio: z
    .string({ message: 'Bio content must be a string.' })
    .trim()
    .max(MAX_BIO_CHARS, {
      message: `Bio can't be longer than ${MAX_BIO_CHARS} characters.`,
    })
    .optional(),
  avatarImageFile: ImageFileSchema.optional(),
  coverImageFile: ImageFileSchema.optional(),
  location: z
    .string({ message: 'Location content must be a string.' })
    .trim()
    .max(MAX_LOCATION_CHARS, {
      message: `Location can't be longer than ${MAX_LOCATION_CHARS} characters.`,
    })
    .optional(),
});

export const FullProfileContent = BasicProfileContent.merge(
  AdditinalProfileInfoContent
);

export type AdditinalProfileInfoZ = z.infer<typeof AdditinalProfileInfoContent>;
export type FullProfileZ = z.infer<typeof FullProfileContent>;

export type { Profile as default };
