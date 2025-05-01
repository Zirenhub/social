"use server";

import { revalidateTag } from "next/cache";

import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { CommentContent } from "@/types/comment";
import { CACHE_TAGS } from "@/types/constants";
import { updateLastActive } from "../auth/actions";
import successResponse, { errorResponse } from "../response";

export async function createComment({
  content,
  postId,
  parentId,
}: {
  content: string;
  postId: string;
  parentId?: string;
}) {
  try {
    const session = await getSession();
    const parsed = CommentContent.parse({ content });
    const post = await prisma.comment.create({
      data: {
        content: parsed.content,
        profileId: session.user.profile,
        postId,
        parentId,
      },
    });

    await updateLastActive("comment");
    revalidateTag(CACHE_TAGS.POST(postId));

    return successResponse(post);
  } catch (error) {
    return errorResponse(error, "Something went wrong creating post.");
  }
}

export async function likeComment(commentId: string) {
  try {
    const session = await getSession();
    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.commentLike.findUnique({
        where: {
          commentId_profileId: {
            commentId,
            profileId: session.user.profile,
          },
        },
      });
      // If already liked, remove the like (toggle functionality)
      if (existingLike) {
        await tx.commentLike.delete({
          where: {
            commentId_profileId: {
              commentId,
              profileId: session.user.profile,
            },
          },
        });
        return null;
      }

      // Create a new like
      return await tx.commentLike.create({
        data: {
          commentId,
          profileId: session.user.profile,
        },
      });
    });

    await updateLastActive("like");
    return successResponse(result);
  } catch (error) {
    return errorResponse(error, "Something went wrong liking post.");
  }
}

export async function deleteComment({ id }: { id: string }) {
  try {
    const comment = await prisma.comment.findUniqueOrThrow({ where: { id } });
    const session = await getSession();

    if (comment.profileId !== session.user.profile) {
      throw new Error("Unauthorized to delete this comment.");
    }

    const deletedComment = await prisma.comment.delete({ where: { id } });

    return successResponse(deletedComment);
  } catch (error) {
    return errorResponse(error, "Something went wrong liking post.");
  }
}
