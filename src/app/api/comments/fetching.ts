import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { PaginatedData } from "@/types/api";
import { commentArgs, CommentWithCounts, CommentWithReplies } from "@/types/comment";
import { PER_PAGE } from "@/types/constants";
import { getPost } from "../posts/fetching";
import { errorResponse } from "../response";

type GetCommentsProps = {
  filter: "newest" | "popular";
  postId: string;
  userProfileId: string;
  cursor?: string;
  parentId?: string | null;
};

type Props = {
  postId: string;
  userProfileId: string;
  cursor?: string;
  parentId?: string | null;
};
const getNewestComments = async ({ postId, userProfileId, cursor, parentId }: Props) => {
  const comments = await prisma.comment.findMany({
    ...commentArgs(userProfileId),
    where: {
      postId,
      ...(parentId !== undefined ? { parentId } : { parentId: null }),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: PER_PAGE + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const hasMore = comments.length === PER_PAGE + 1;
  if (hasMore) comments.pop();

  return {
    data: comments,
    nextCursor: hasMore ? comments[comments.length - 1]?.id : null,
  };
};

const getPopularComments = async ({ postId, userProfileId, cursor, parentId }: Props) => {
  const comments = await prisma.comment.findMany({
    ...commentArgs(userProfileId),
    where: {
      postId,
      ...(parentId !== undefined ? { parentId } : { parentId: null }),
      likes: { some: {} },
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: PER_PAGE + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const hasMore = comments.length === PER_PAGE + 1;
  if (hasMore) comments.pop();

  return {
    data: comments,
    nextCursor: hasMore ? comments[comments.length - 1]?.id : null,
  };
};

export const getComments = async ({
  filter,
  postId,
  userProfileId,
  cursor,
  parentId,
}: GetCommentsProps): Promise<PaginatedData<CommentWithCounts>> => {
  try {
    if (filter === "newest") {
      return await getNewestComments({
        postId,
        userProfileId,
        cursor,
        parentId,
      });
    }

    if (filter === "popular") {
      return await getPopularComments({
        postId,
        userProfileId,
        cursor,
        parentId,
      });
    }

    throw new Error("Invalid filter type");
  } catch (error) {
    const err = errorResponse(error, "Failed getting home page posts.");
    throw new Error(err.error.message);
  }
};

const recursiveComments = async (
  parentId: string,
  userProfileId: string,
  comments: CommentWithCounts[] = []
): Promise<CommentWithCounts[]> => {
  const comment = await prisma.comment.findUnique({ where: { id: parentId }, ...commentArgs(userProfileId) });
  if (!comment) return comments;
  const nextComments = [comment, ...comments];
  if (!comment.parentId) return nextComments;
  return recursiveComments(comment.parentId, userProfileId, nextComments);
};

export const getComment = async ({ commentId }: { commentId: string }): Promise<CommentWithReplies> => {
  try {
    const auth = await getSession();
    const userProfileId = auth.user.profile;
    const comment = await prisma.comment.findUniqueOrThrow({ where: { id: commentId }, ...commentArgs(userProfileId) });
    const parents = comment.parentId ? await recursiveComments(comment.parentId, userProfileId) : [];
    const post = await getPost({ postId: comment.postId, userProfileId });

    return { comment, parents, post };
  } catch (error) {
    const err = errorResponse(error, "Failed getting comment.");
    throw new Error(err.error.message);
  }
};
