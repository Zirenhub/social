"use client";

import { useCallback, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { ApiResponse, PaginatedData } from "@/types/api";

type UseLikeToggleParams<T, A> = {
  itemId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  mutationFn: (itemId: string) => Promise<ApiResponse<A | null>>;
  queryKey?: unknown[];
  updateItemLikes: (item: T, result: ApiResponse<A | null>) => T;
};

export function useLikeToggle<T, A>({
  itemId,
  initialIsLiked,
  initialLikeCount,
  mutationFn,
  queryKey,
  updateItemLikes,
}: UseLikeToggleParams<T, A>) {
  const queryClient = useQueryClient();
  const [likesStatus, setLikesStatus] = useState({
    isLiked: initialIsLiked,
    count: initialLikeCount,
  });
  const [isPending, startTransition] = useTransition();

  const handleLike = useCallback(() => {
    setLikesStatus((prev) => ({
      isLiked: !prev.isLiked,
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
    }));

    startTransition(async () => {
      try {
        const result = await mutationFn(itemId);

        if (!result.success) {
          throw new Error(result.error?.message || "Like action failed");
        }

        if (queryKey) {
          queryClient.setQueriesData<{
            pages: PaginatedData<T>[];
            pageParam: string[];
          }>({ queryKey }, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((item) => ((item as any).id === itemId ? updateItemLikes(item, result) : item)),
              })),
            };
          });
        }
      } catch (err) {
        setLikesStatus((prev) => ({
          isLiked: !prev.isLiked,
          count: prev.isLiked ? prev.count + 1 : prev.count - 1,
        }));

        toast.error(`Failed to like: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    });
  }, [itemId, mutationFn, queryKey, queryClient, updateItemLikes]);

  return {
    isPending,
    handleLike,
    isLiked: likesStatus.isLiked,
    likeCount: likesStatus.count,
  };
}
