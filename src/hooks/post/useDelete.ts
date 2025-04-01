'use client';
import { deletePost } from '@/app/api/posts/actions';
import { useTransition } from 'react';
import { toast } from 'react-toastify';

type Props = {
  postId: string;
  onSuccess?: () => void;
};

export default function useDelete({ postId, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDeletePost() {
    startTransition(async () => {
      const result = await deletePost({ postId });
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success('Post successfully deleted');
      if (onSuccess) onSuccess();
    });
  }

  return { isPending, handleDeletePost };
}
