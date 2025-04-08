'use server';
import getSession from '@/lib/getSession';
import { prisma } from '@/lib/prisma';
import { CommentContent } from '@/types/comment';
import successResponse, { errorResponse } from '../response';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/types/constants';

export async function createComment({
  content,
  postId,
}: {
  content: string;
  postId: string;
}) {
  try {
    const session = await getSession();
    const parsed = CommentContent.parse({ content });
    const post = await prisma.comment.create({
      data: {
        content: parsed.content,
        profileId: session.user.profile,
        postId,
      },
    });

    revalidateTag(CACHE_TAGS.POST(postId));

    return successResponse(post);
  } catch (error) {
    return errorResponse(error, 'Something went wrong creating post.');
  }
}
