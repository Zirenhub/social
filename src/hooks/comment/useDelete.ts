"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { deleteComment } from "@/app/api/comments/actions";
import { CACHE_TAGS } from "@/types/constants";

type Props = {
  commentId: string;
  postId: string;
  onSuccess?: () => void;
};

export default function useDelete({ commentId, postId, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  function handleDeletePost() {
    startTransition(async () => {
      const result = await deleteComment({ id: commentId });
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.COMMENTS(postId)],
      });
      toast.success("Comment successfully deleted");
      if (onSuccess) onSuccess();
    });
  }

  return { isPending, handleDeletePost };
}
