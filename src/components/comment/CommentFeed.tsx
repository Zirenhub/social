"use client";

import { useState } from "react";
import { MessageSquare, RefreshCw } from "lucide-react";

import useInfiniteScroll from "@/hooks/post/useInfiniteScroll";
import { CommentsFilter, CommentWithCounts } from "@/types/comment";
import { CACHE_TAGS } from "@/types/constants";
import { PostWithCounts } from "@/types/post";
import ContainerPlaceholder from "../ui/ContainerPlaceholder";
import CommentContainer from "./CommentContainer";

type Props = {
  post: PostWithCounts;
  comment?: CommentWithCounts;
  parents?: CommentWithCounts[];
};

export default function CommentFeed({ post, comment, parents }: Props) {
  const [filter, setFilter] = useState<CommentsFilter>("newest");

  const queryString = comment ? CACHE_TAGS.COMMENTS(comment.id) : CACHE_TAGS.COMMENTS(post.id);
  const queryKey = [queryString, filter];

  const { isLoading, isEmpty, result, isError, error } = useInfiniteScroll<CommentWithCounts>({
    endpoint: `/api/comments/${post.id}`,
    filter,
    queryKey,
    comment,
  });

  return (
    <div className="p-2">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b mb-4 border-gray-100 pb-4 dark:border-gray-800">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-1 dark:bg-gray-800">
          <button
            onClick={() => setFilter("newest")}
            className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "newest"
                ? "bg-white text-[var(--color-cyan-500)] shadow-sm dark:bg-gray-700 dark:text-[var(--color-cyan-500)]"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setFilter("popular")}
            className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "popular"
                ? "bg-white text-[var(--color-magenta-500)] shadow-sm dark:bg-gray-700 dark:text-[var(--color-magenta-500)]"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Popular
          </button>
          <button className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-[var(--color-blue-500)] dark:hover:bg-gray-700 dark:hover:text-[var(--color-blue-500)]">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <ContainerPlaceholder key={i} />
          ))}
        </div>
      )}

      {isError && <p className="text-red-400 text-center">{error?.message}</p>}

      {isEmpty && filter === "newest" ? (
        <div className="my-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-gray-50/80 to-white p-10 text-center shadow-sm dark:from-gray-800/80 dark:to-gray-900">
          <div className="mb-4 rounded-full bg-[var(--color-cyan-500)]/10 p-4">
            <MessageSquare className="h-10 w-10 text-[var(--color-cyan-500)]" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">No comments yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {result.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <CommentContainer post={post} comment={comment} parents={parents} queryKey={queryString} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
