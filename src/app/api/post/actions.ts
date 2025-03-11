'use server';
import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { PostContent } from '@/types/post';
import { getSession } from '@/lib/session';

export async function createPost({ content }: { content: string }) {
  try {
    const user = await getSession();
    if (!user.success || !user.data) {
      throw new Error('User could not be verified.');
    }
    const parsed = PostContent.parse({ content });
    const post = await prisma.post.create({
      data: { content: parsed.content, profileId: user.data.profile.id },
    });

    return successResponse(post);
  } catch (error) {
    return errorResponse(error, 'Something went wrong creating post.');
  }
}
