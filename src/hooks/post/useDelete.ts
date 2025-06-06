"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { deletePost } from "@/app/api/posts/actions";
import { CACHE_TAGS } from "@/types/constants";

type Props = {
  postId: string;
  onSuccess?: () => void;
};

export default function useDelete({ postId, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  function handleDeletePost() {
    startTransition(async () => {
      const result = await deletePost({ postId });
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.POSTS],
      });
      toast.success("Post successfully deleted");
      if (onSuccess) onSuccess();
    });
  }

  return { isPending, handleDeletePost };
}
