'use client';
import { likePost } from '@/app/api/posts/actions';
import { PostWithCounts } from '@/types/post';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useTransition, useCallback } from 'react';
import { toast } from 'react-toastify';

type Props = {
  post: PostWithCounts;
  initialIsLiked: boolean;
  initialLikeCount: number;
};

export default function useLike({
  post,
  initialIsLiked,
  initialLikeCount,
}: Props) {
  const [likesStatus, setLikesStatus] = useState({
    isLiked: initialIsLiked,
    count: initialLikeCount,
  });
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleLike = useCallback(() => {
    // Optimistic update
    setLikesStatus((prev) => ({
      isLiked: !prev.isLiked,
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
    }));

    startTransition(async () => {
      try {
        const result = await likePost({ postId: post.id });

        if (!result.success || !result.data) {
          throw new Error(result.error?.message || 'Failed to like post');
        }
      } catch (error) {
        // Revert on error
        setLikesStatus((prev) => ({
          isLiked: !prev.isLiked,
          count: prev.isLiked ? prev.count + 1 : prev.count - 1,
        }));
        toast.error(
          `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }, [post.id, queryClient]);

  return { isPending, handleLike, likesStatus };
}
