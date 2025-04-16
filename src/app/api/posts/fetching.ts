import { unstable_cacheTag as cacheTag } from "next/cache";
import { subDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { PaginatedData } from "@/types/api";
import { CACHE_TAGS, HomePagePostsFilter, PER_PAGE } from "@/types/constants";
import { postQuery, PostWithCounts } from "@/types/post";
import { errorResponse } from "../response";

// Constants for pagination

type GetHomePostsOptions = {
  filter: HomePagePostsFilter;
  userProfileId: string;
  cursor?: string;
};

type filterProps = {
  profileId: string;
  cursor?: string;
};

export const getHomePosts = async ({
  filter,
  userProfileId,
  cursor,
}: GetHomePostsOptions): Promise<PaginatedData<PostWithCounts>> => {
  try {
    if (filter === "forYou") {
      return await getForYouPosts({ profileId: userProfileId, cursor });
    }

    if (filter === "following") {
      return await getFollowingPosts({ profileId: userProfileId, cursor });
    }

    if (filter === "trending") {
      return await getTrendingPosts({ profileId: userProfileId, cursor });
    }

    throw new Error("Invalid filter type");
  } catch (error) {
    const err = errorResponse(error, "Failed getting home page posts.");
    throw new Error(err.error.message);
  }
};

async function getForYouPosts({ profileId, cursor }: filterProps) {
  const posts = await prisma.post.findMany({
    ...postQuery({ userProfileId: profileId }),
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: PER_PAGE + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const hasMore = posts.length === PER_PAGE + 1;
  if (hasMore) posts.pop();

  return {
    data: posts,
    nextCursor: hasMore ? posts[posts.length - 1]?.id : null,
  };
}

async function getFollowingPosts({ profileId, cursor }: filterProps) {
  const followingRelationships = await prisma.follow.findMany({
    where: { followerId: profileId },
    select: { followingId: true },
  });

  const followingIds = followingRelationships.map((rel) => rel.followingId);

  if (followingIds.length === 0) {
    return { data: [], nextCursor: null };
  }

  const posts = await prisma.post.findMany({
    ...postQuery({ userProfileId: profileId }),
    where: { profileId: { in: followingIds } },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: PER_PAGE + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const hasMore = posts.length === PER_PAGE + 1;
  if (hasMore) posts.pop();

  return {
    data: posts,
    nextCursor: hasMore ? posts[posts.length - 1]?.id : null,
  };
}

async function getTrendingPosts({ profileId, cursor }: filterProps) {
  const yesterday = subDays(new Date(), 30);

  const posts = await prisma.post.findMany({
    ...postQuery({ userProfileId: profileId }),
    where: {
      createdAt: { gte: yesterday },
      likes: { some: {} },
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: PER_PAGE + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const hasMore = posts.length === PER_PAGE + 1;
  if (hasMore) posts.pop();

  return {
    data: posts,
    nextCursor: hasMore ? posts[posts.length - 1]?.id : null,
  };
}

export async function getPost({ postId, userProfileId }: { postId: string; userProfileId: string }) {
  "use cache";
  cacheTag(CACHE_TAGS.POST(postId));
  try {
    const post = await prisma.post.findUniqueOrThrow({
      where: { id: postId },
      ...postQuery({ userProfileId }),
    });
    return post;
  } catch (error) {
    const err = errorResponse(error, "Failed getting post.");
    throw new Error(err.error.message);
  }
}
