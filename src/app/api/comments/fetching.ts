import { prisma } from "@/lib/prisma";
import { PaginatedData } from "@/types/api";
import { commentArgs, CommentWithCounts } from "@/types/comment";
import { PER_PAGE } from "@/types/constants";
import { errorResponse } from "../response";

type GetCommentsProps = {
  filter: "newest" | "popular";
  postId: string;
  userProfileId: string;
  cursor?: string;
};

type Props = {
  postId: string;
  userProfileId: string;
  cursor?: string;
};
const getNewestComments = async ({ postId, userProfileId, cursor }: Props) => {
  const comments = await prisma.comment.findMany({
    ...commentArgs(userProfileId),
    where: {
      postId,
      parentId: null,
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

const getPopularComments = async ({ postId, userProfileId, cursor }: Props) => {
  const comments = await prisma.comment.findMany({
    ...commentArgs(userProfileId),
    where: {
      postId,
      parentId: null,
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

// add promise return type to func
export const getComments = async ({
  filter,
  postId,
  userProfileId,
  cursor,
}: GetCommentsProps): Promise<PaginatedData<CommentWithCounts>> => {
  try {
    if (filter === "newest") {
      return await getNewestComments({
        postId,
        userProfileId,
        cursor,
      });
    }

    if (filter === "popular") {
      return await getPopularComments({
        postId,
        userProfileId,
        cursor,
      });
    }

    throw new Error("Invalid filter type");
  } catch (error) {
    const err = errorResponse(error, "Failed getting home page posts.");
    throw new Error(err.error.message);
  }
};
