import { z } from 'zod';
import { Post, Prisma } from '@prisma/client';
import { HomePagePostsFilter } from './constants';

export const MAX_POST_CHARS = 256;

export const PostContent = z.object({
  content: z
    .string({ message: 'Post content must be a string.' })
    .trim()
    .min(1, { message: "Post can't be empty" })
    .max(MAX_POST_CHARS, {
      message: "Post can't be longer than 256 characters.",
    }),
});

type PostContentZ = z.infer<typeof PostContent>;

const postWithCountsArgs = {
  include: {
    profile: { select: { id: true } } as const,
    _count: { select: { likes: true, comments: true } } as const,
  },
  orderBy: { createdAt: Prisma.SortOrder.desc } as const,
} as const;

const validatedArgs =
  Prisma.validator<Prisma.PostFindManyArgs>()(postWithCountsArgs);
type PostWithCounts = Prisma.PostGetPayload<typeof validatedArgs>;

type postQueryProps = {
  profileId?: string;
};

export const postQuery = ({
  profileId,
}: postQueryProps): typeof validatedArgs => {
  const query = { ...validatedArgs };

  if (profileId) {
    (query as Prisma.PostFindManyArgs).where = { profileId };
  }

  return query;
};

export type { PostContentZ, Post, PostWithCounts };
