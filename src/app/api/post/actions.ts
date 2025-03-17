'use server';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { PostContent } from '@/types/post';
import { revalidateTag } from 'next/cache';
import { getUser } from '@/lib/session';
import { CACHE_TAGS } from '@/types/constants';

// update last active on actions

export async function createPost({ content }: { content: string }) {
  try {
    const user = await getUser();
    const parsed = PostContent.parse({ content });
    const post = await prisma.post.create({
      data: { content: parsed.content, profileId: user.profile.id },
    });

    revalidateTag(CACHE_TAGS.POSTS); // revalidate home page since new post will alawys show there
    revalidateTag(CACHE_TAGS.PROFILE_POSTSCOUNT(user.profile.id));
    // revalidate this user's profile page posts

    return successResponse(post);
  } catch (error) {
    return errorResponse(error, 'Something went wrong creating post.');
  }
}

export async function deletePost({ postId }: { postId: string }) {
  try {
    const user = await getUser();
    const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

    if (post.profileId !== user.profile.id) {
      throw new Error('User not authorized to delete post.');
    }

    const deletedPost = await prisma.post.delete({ where: { id: postId } });

    revalidateTag(CACHE_TAGS.POSTS);
    revalidateTag(CACHE_TAGS.PROFILE_POSTSCOUNT(user.profile.id));

    return successResponse(deletedPost);
  } catch (error) {
    return errorResponse(error, 'Something went wrong deleting post.');
  }
}
