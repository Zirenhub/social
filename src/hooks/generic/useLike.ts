"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import formatCount from "@/helpers/fomatCount";
import { ApiResponse, PaginatedData } from "@/types/api";

// Define the interface that items must have
interface LikeableItem {
  id: string;
  likes: any[];
  _count: { likes: number };
}

type UseLikeToggleParams<T extends LikeableItem, A> = {
  itemId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  mutationFn: (itemId: string) => Promise<ApiResponse<A | null>>;
  queryKey?: unknown[];
};

export function useLikeToggle<T extends LikeableItem, A>({
  itemId,
  initialIsLiked,
  initialLikeCount,
  mutationFn,
  queryKey,
}: UseLikeToggleParams<T, A>) {
  const queryClient = useQueryClient();
  const [likesStatus, setLikesStatus] = useState({
    isLiked: initialIsLiked,
    count: initialLikeCount,
  });
  const [isPending, startTransition] = useTransition();

  const safeMutation = useCallback((itemId: string) => mutationFn(itemId), [mutationFn]);

  const formattedLikesCount = useMemo(() => formatCount(likesStatus.count, "Like"), [likesStatus.count]);
  const formattedIsLiked = useMemo(() => likesStatus.isLiked, [likesStatus.isLiked]);

  const handleLike = useCallback(() => {
    setLikesStatus((prev) => ({
      isLiked: !prev.isLiked,
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
    }));

    startTransition(async () => {
      try {
        const result = await safeMutation(itemId);

        if (!result.success) {
          throw new Error(result.error?.message || "Like action failed");
        }

        if (queryKey?.length) {
          queryKey.forEach((key) => {
            queryClient.setQueriesData<{
              pages: PaginatedData<T>[];
              pageParam: string[];
            }>({ queryKey: [key] }, (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((item) => {
                    if (item.id === itemId) {
                      return {
                        ...item,
                        likes: result.data ? [result.data] : [],
                        _count: {
                          ...item._count,
                          likes: result.data ? item._count.likes + 1 : item._count.likes - 1,
                        },
                      } as T;
                    }
                    return item;
                  }),
                })),
              };
            });
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
  }, [itemId, safeMutation, queryKey, queryClient]);

  return {
    isPending,
    handleLike,
    isLiked: formattedIsLiked,
    likeCount: formattedLikesCount,
  };
}
