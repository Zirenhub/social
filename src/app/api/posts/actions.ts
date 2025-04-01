'use server';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { PostContent } from '@/types/post';
import getSession from '@/lib/getSession';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';

// update last active on actions

export async function createPost({ content }: { content: string }) {
  try {
    const session = await getSession();
    const parsed = PostContent.parse({ content });
    const post = await prisma.post.create({
      data: { content: parsed.content, profileId: session.user.profile },
    });

    revalidateTag(CACHE_TAGS.POSTS); // revalidate home page since new post will alawys show there
    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile)); // revalidate profile page since new post will show there (this will also revalidate the count)

    return successResponse(post);
  } catch (error) {
    return errorResponse(error, 'Something went wrong creating post.');
  }
}

export async function deletePost({ postId }: { postId: string }) {
  try {
    const session = await getSession();
    const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

    if (post.profileId !== session.user.profile) {
      throw new Error('User not authorized to delete post.');
    }

    const deletedPost = await prisma.post.delete({ where: { id: postId } });

    revalidateTag(CACHE_TAGS.POSTS);
    revalidateTag(CACHE_TAGS.PROFILE(session.user.profile)); // revalidate profile page since post will be removed (this will also revalidate the count)

    return successResponse(deletedPost);
  } catch (error) {
    return errorResponse(error, 'Something went wrong deleting post.');
  }
}

export async function likePost({ postId }: { postId: string }) {
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
        return await tx.like.delete({
          where: {
            postId_profileId: {
              postId,
              profileId: session.user.profile,
            },
          },
        });
      }

      // Create a new like
      return await tx.like.create({
        data: {
          postId,
          profileId: session.user.profile,
        },
      });
    });

    revalidateTag(CACHE_TAGS.POSTS);

    return successResponse(result);
  } catch (error) {
    return errorResponse(error, 'Something went wrong liking post.');
  }
}
