import { z } from 'zod';
import { Post, Prisma } from '@prisma/client';
import { getMaxCharError, getMinCharError } from '@/helpers/charLenghtError';

export const MAX_POST_CHARS = 256;

export const PostContent = z.object({
  content: z
    .string({ message: 'Post content must be a string.' })
    .trim()
    .min(1, getMinCharError('Post', 1))
    .max(MAX_POST_CHARS, getMaxCharError('Post', MAX_POST_CHARS)),
});

type PostContentZ = z.infer<typeof PostContent>;

const postWithCountsArgs = (userProfileId: string) =>
  ({
    include: {
      profile: {
        select: { firstName: true, lastName: true, username: true },
      } as const,
      _count: { select: { likes: true, comments: true } } as const,
      likes: {
        where: {
          profileId: userProfileId,
        },
        take: 1,
      },
    },
  }) as const;

const validatedArgs = (userProfileId: string) =>
  Prisma.validator<Prisma.PostFindManyArgs>()(
    postWithCountsArgs(userProfileId)
  );
type PostWithCounts = Prisma.PostGetPayload<ReturnType<typeof validatedArgs>>;

type postQueryProps = {
  profileId?: string;
  userProfileId: string;
};

export const postQuery = ({
  profileId,
  userProfileId,
}: postQueryProps): ReturnType<typeof validatedArgs> => {
  const query = { ...validatedArgs(userProfileId) };

  if (profileId) {
    (query as Prisma.PostFindManyArgs).where = { profileId };
  }

  return query;
};

export type { PostContentZ, Post, PostWithCounts };
