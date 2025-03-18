import { z } from 'zod';
import { Post, Prisma } from '@prisma/client';

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

type PostWithProfileAndCounts = Prisma.PostGetPayload<{
  include: {
    profile: true;
    _count: { select: { likes: true; comments: true } };
  };
  orderBy: { createdAt: typeof Prisma.SortOrder.desc };
}>;

export const postQuery = (profileId?: string) => ({
  where: profileId ? { profileId } : {},
  include: {
    profile: true,
    _count: { select: { likes: true, comments: true } },
  },
  orderBy: { createdAt: Prisma.SortOrder.desc },
});

export type { PostContentZ, Post, PostWithProfileAndCounts };
