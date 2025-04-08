import { z } from 'zod';
import { Comment, Prisma } from '@prisma/client';
import { getMaxCharError, getMinCharError } from '@/helpers/charLenghtError';

export const MAX_COMMENT_CHARS = 256;

export const CommentContent = z.object({
  content: z
    .string({ message: 'Comment content must be a string.' })
    .trim()
    .min(1, getMinCharError('Comment', 1))
    .max(MAX_COMMENT_CHARS, getMaxCharError('Comment', MAX_COMMENT_CHARS)),
});

type CommentContentZ = z.infer<typeof CommentContent>;
type CommentsFilter = 'newest' | 'popular';

const commentWithCountsArgs = (userProfileId: string) =>
  ({
    include: {
      profile: {
        select: { firstName: true, lastName: true, username: true },
      } as const,
      _count: { select: { likes: true, replies: true } } as const,
      likes: {
        where: {
          profileId: userProfileId,
        },
        take: 1,
      },
    },
  }) as const;

export const commentArgs = (userProfileId: string) =>
  Prisma.validator<Prisma.CommentFindManyArgs>()(
    commentWithCountsArgs(userProfileId)
  );
type CommentWithCounts = Prisma.CommentGetPayload<
  ReturnType<typeof commentArgs>
>;

export type { CommentContentZ, Comment, CommentWithCounts, CommentsFilter };
