'use server';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { PostContent } from '@/types/post';
import { revalidateTag } from 'next/cache';
import { getUser } from '@/lib/session';

export async function createPost({ content }: { content: string }) {
  try {
    const user = await getUser();
    const parsed = PostContent.parse({ content });
    const post = await prisma.post.create({
      data: { content: parsed.content, profileId: user.profile.id },
    });

    revalidateTag('posts');

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

    revalidateTag('posts');

    return successResponse(deletedPost);
  } catch (error) {
    return errorResponse(error, 'Something went wrong deleting post.');
  }
}
