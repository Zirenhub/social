"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CommentLike } from "@prisma/client";
import { Heart, MessageSquare, Share2 } from "lucide-react";

import { likeComment } from "@/app/api/comments/actions";
import { useModal } from "@/context/ModalProvider";
import formatCount from "@/helpers/fomatCount";
import { useLikeToggle } from "@/hooks/generic/useLike";
import { CommentWithCounts } from "@/types/comment";
import { CACHE_TAGS } from "@/types/constants";
import { PostWithCounts } from "@/types/post";
import CreateReply from "../ui/modal/CreateReply";
import CreateRepost from "../ui/modal/CreateRepost";

type Props = {
  post: PostWithCounts;
  comment: CommentWithCounts;
  parents?: CommentWithCounts[];
  queryKey?: string;
};

function CommentInteractions({ post, comment, parents, queryKey }: Props) {
  const { openModal } = useModal();

  const keys = useMemo(() => {
    const query: string[] = [];
    query.push(CACHE_TAGS.COMMENTS(post.id));
    if (queryKey) {
      query.push(queryKey);
    }
    if (parents) {
      parents.forEach((parent) => query.push(CACHE_TAGS.COMMENTS(parent.id)));
    }
    return query;
  }, [post.id, queryKey, parents]);

  const { handleLike, isLiked, likeCount, isPending } = useLikeToggle<CommentWithCounts, CommentLike>({
    itemId: comment.id,
    initialIsLiked: comment.likes.length > 0,
    initialLikeCount: comment._count.likes,
    mutationFn: likeComment,
    queryKey: keys,
  });

  const handleReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    openModal(<CreateReply post={post} comment={comment} parents={parents} />, { title: "Reply" });
  };

  const handleRepost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    openModal(<CreateRepost post={post} comment={comment} parents={parents} />, { title: "Reply" });
  };

  const formattedCommentsCount = useMemo(
    () => formatCount(comment._count.replies, "Replies"),
    [comment._count.replies]
  );

  return (
    <div className="flex flex-wrap md:items-center md:gap-3 md:px-2 text-sm">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleLike();
        }}
        className={`group flex items-center gap-1 md:gap-1.5 rounded-full pr-3 py-1.5 transition-colors font-medium ${
          isLiked
            ? "px-3 bg-[var(--color-magenta-500)]/10 text-[var(--color-magenta-500)]"
            : "text-gray-500 dark:text-gray-400 hover:text-[var(--color-magenta-500)] hover:bg-[var(--color-magenta-500)]/10"
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-all duration-200 ${
            isLiked ? "fill-[var(--color-magenta-500)]" : "group-hover:fill-[var(--color-magenta-500)]/20"
          }`}
        />
        <span>{likeCount}</span>
      </button>

      <button
        onClick={handleReply}
        className="group flex items-center gap-1 md:gap-1.5 rounded-full px-3 py-1.5 font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)]/10"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Reply</span>
      </button>

      <button
        onClick={handleRepost}
        className="group flex items-center gap-1 md:gap-1.5 rounded-full py-1.5 font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-[var(--color-lime-500)] hover:bg-[var(--color-lime-500)]/10"
      >
        <Share2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
        <span>Share</span>
      </button>

      {comment._count.replies > 0 && (
        <div className="ml-auto flex items-center gap-1 rounded-full bg-[var(--color-blue-500)]/10 px-3 py-1.5 text-[var(--color-blue-500)] font-medium text-xs">
          <MessageSquare className="h-4 w-4" />
          <span>
            {comment._count.replies} {comment._count.replies === 1 ? "reply" : "replies"}
          </span>
        </div>
      )}
    </div>
  );
}

export default React.memo(CommentInteractions);
