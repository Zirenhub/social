"use client";

import React from "react";
import { CommentLike } from "@prisma/client";
import { Heart, MessageSquare, Share2 } from "lucide-react";

import { likeComment } from "@/app/api/comments/actions";
import { useModal } from "@/context/ModalProvider";
import { useLikeToggle } from "@/hooks/generic/useLike";
import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";
import CreateReply from "../ui/modal/CreateReply";

type Props = {
  post: PostWithCounts;
  comment: CommentWithCounts;
  parents?: CommentWithCounts[];
  queryKey?: string[];
};

export default function CommentInteractions({ post, comment, parents, queryKey }: Props) {
  const { openModal } = useModal();
  // when on the post page this works because on like we will update the page data,
  // but if we are on the /comment/123 page for example and we like that comment
  // this will attempt to update the liked comment inside the comments page query
  // solution 1 (?): inside toggle check if we have comment parent id, if we do dont update!, then ??
  // solution 2 (?): take prop from container and decide accoridngly
  // regardless, finally after doing 1 or 2, if we update cache dont do anything else, if we dont update cache, invalidate query so fresh data is shown next time.
  const { handleLike, isLiked, likeCount, isPending } = useLikeToggle<CommentWithCounts, CommentLike>({
    itemId: comment.id,
    initialIsLiked: comment.likes.length > 0,
    initialLikeCount: comment._count.likes,
    mutationFn: likeComment,
    queryKey,
    updateItemLikes: (item, result) => ({
      ...item,
      likes: result.data ? [result.data] : [],
      _count: {
        ...item._count,
        likes: result.data ? item._count.likes + 1 : item._count.likes - 1,
      },
    }),
  });

  const handleReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    openModal(<CreateReply post={post} comment={comment} parents={parents} />, { title: "Reply" });
  };

  return (
    <div className="flex flex-wrap md:items-center gap-3 md:px-2 text-sm">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleLike();
        }}
        className={`group flex items-center gap-1 md:gap-1.5 rounded-full md:px-3 py-1.5 transition-colors font-medium ${
          isLiked
            ? "bg-[var(--color-magenta-500)]/10 text-[var(--color-magenta-500)]"
            : "text-gray-500 dark:text-gray-400 hover:text-[var(--color-magenta-500)] hover:bg-[var(--color-magenta-500)]/10"
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-all duration-200 ${
            isLiked ? "fill-[var(--color-magenta-500)]" : "group-hover:fill-[var(--color-magenta-500)]/20"
          }`}
        />
        <span>{likeCount > 0 ? likeCount : "Like"}</span>
      </button>

      <button
        onClick={handleReply}
        className="group flex items-center gap-1 md:gap-1.5 rounded-full md:px-3 py-1.5 font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)]/10"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Reply</span>
      </button>

      <button className="group flex items-center gap-1 md:gap-1.5 rounded-full md:px-3 py-1.5 font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-[var(--color-lime-500)] hover:bg-[var(--color-lime-500)]/10">
        <Share2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
        <span>Share</span>
      </button>

      {comment._count.replies > 0 && (
        <div className="ml-auto flex items-center gap-2 rounded-full bg-[var(--color-blue-500)]/10 px-3 py-1.5 text-[var(--color-blue-500)] font-medium text-xs">
          <MessageSquare className="h-4 w-4" />
          <span>
            {comment._count.replies} {comment._count.replies === 1 ? "reply" : "replies"}
          </span>
        </div>
      )}
    </div>
  );
}
