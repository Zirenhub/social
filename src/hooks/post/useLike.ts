'use client';

import { likePost } from '@/app/api/posts/actions';
import { PostWithCounts } from '@/types/post';
import { useTransition } from 'react';
import { toast } from 'react-toastify';

type Props = {
  post: PostWithCounts;
};

export default function useLike({ post }: Props) {
  const [isPending, startTransition] = useTransition();

  const postIsLiked = post.likes.length > 0;

  const handleLike = () => {
    startTransition(async () => {
      const result = await likePost({ postId: post.id });
      if (!result.success || !result.data) {
        toast.error(
          `Something went wrong,
                ${result.error?.message || 'unknown'}`
        );
      }
    });
  };

  return { isPending, handleLike, postIsLiked };
}
