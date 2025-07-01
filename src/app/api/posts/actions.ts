"use server";

import { revalidateTag } from "next/cache";

import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/types/constants";
import { PostContent } from "@/types/post";
import { updateLastActive } from "../auth/actions";
import successResponse, { errorResponse } from "../response";

// update last active on actions

export async function createPost({ content, repostOfId }: { content: string; repostOfId?: string }) {
  try {
    const session = await getSession();
    const parsed = PostContent.parse({ content });
    const post = await prisma.post.create({
      data: { content: parsed.content, profileId: session.user.profile, repostOfId },
    });

    await updateLastActive("post");
    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile)); // revalidate profile (this will also revalidate the count)

    return successResponse(post);
  } catch (error) {
    return errorResponse(error, "Something went wrong creating post.");
  }
}

export async function deletePost({ postId }: { postId: string }) {
  try {
    const session = await getSession();
    const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

    if (post.profileId !== session.user.profile) {
      throw new Error("User not authorized to delete post.");
    }

    const deletedPost = await prisma.post.delete({ where: { id: postId } });

    await updateLastActive("post");
    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile)); // revalidate profile page (this will also revalidate the count)
    revalidateTag(CACHE_TAGS.POST(postId));

    return successResponse(deletedPost);
  } catch (error) {
    return errorResponse(error, "Something went wrong deleting post.");
  }
}

export async function likePost(postId: string) {
  try {
    const session = await getSession();
    // Use a transaction to ensure atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Check if like already exists to prevent duplicate likes
      const existingLike = await tx.like.findUnique({
        where: {
          postId_profileId: {
            postId,
            profileId: session.user.profile,
          },
        },
      });
      // If already liked, remove the like (toggle functionality)
      if (existingLike) {
        await tx.like.delete({
          where: {
            postId_profileId: {
              postId,
              profileId: session.user.profile,
            },
          },
        });
        return null;
      }

      // Create a new like
      return await tx.like.create({
        data: {
          postId,
          profileId: session.user.profile,
        },
      });
    });

    await updateLastActive("like");
    revalidateTag(CACHE_TAGS.POST(postId));

    return successResponse(result);
  } catch (error) {
    return errorResponse(error, "Something went wrong liking post.");
  }
}
