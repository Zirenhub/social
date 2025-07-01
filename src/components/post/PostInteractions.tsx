"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Like } from "@prisma/client";
import clsx from "clsx";
import { HeartIcon, MessageCircleMoreIcon, RepeatIcon } from "lucide-react";

import { likePost } from "@/app/api/posts/actions";
import { useModal } from "@/context/ModalProvider";
import formatCount from "@/helpers/fomatCount";
import { useLikeToggle } from "@/hooks/generic/useLike";
import { CACHE_TAGS } from "@/types/constants";
import type { PostWithCounts } from "@/types/post";
import CreateReply from "../ui/modal/CreateReply";
import CreateRepost from "../ui/modal/CreateRepost";

type Props = { post: PostWithCounts };

function PostInteractions({ post }: Props) {
  const [isClient, setIsClient] = useState(false);

  const { handleLike, isLiked, likeCount, isPending } = useLikeToggle<PostWithCounts, Like>({
    itemId: post.id,
    initialIsLiked: post.likes.length > 0,
    initialLikeCount: post._count.likes,
    mutationFn: likePost,
    queryKey: [CACHE_TAGS.POSTS],
  });

  const formattedCommentsCount = useMemo(() => formatCount(post._count.comments, "Comments"), [post._count.comments]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { openModal } = useModal();

  const handleCommentClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      // create a seperate create comment modal component, leave create comment component as standalone as differences will be noticable.
      openModal(<CreateReply post={post} />, { title: "Reply" });
    },
    [openModal, post]
  );

  const handleRepostClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      openModal(<CreateRepost post={post} />, { title: "Repost" });
    },
    [openModal, post]
  );

  const handleLikeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      handleLike();
    },
    [handleLike]
  );

  const interactions = useMemo(
    () => [
      {
        label: "Like",
        icon: HeartIcon,
        status: { isLiked, count: likeCount },
        onClick: handleLikeClick,
        isPending: isPending,
      },
      {
        label: "Comments",
        icon: MessageCircleMoreIcon,
        status: { isLiked: false, count: formattedCommentsCount },
        onClick: handleCommentClick,
        isPending: false,
      },
      {
        label: "Repost",
        icon: RepeatIcon,
        status: { isLiked: false, count: 0 },
        onClick: handleRepostClick,
        isPending: false,
      },
    ],
    [isLiked, likeCount, formattedCommentsCount, handleLikeClick, handleCommentClick, handleRepostClick, isPending]
  );

  // Placeholder component when isClient is false
  if (!isClient) {
    return (
      <div className="flex gap-4 text-gray-500 dark:text-gray-400 pt-3 top-seperator">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-1 h-9 animate-pulse">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 text-gray-500 dark:text-gray-400 pb-2 px-2">
      {interactions.map((interaction) => {
        return (
          <button
            disabled={interaction.isPending}
            key={interaction.label}
            onClick={(e) => interaction.onClick(e)}
            className={clsx(
              "cursor-pointer text-sm md:text-base rounded-full flex items-center gap-1 transition-colors px-2",
              "hover:text-magenta-500 hover:bg-magenta-500/20",
              interaction.status.isLiked && "bg-magenta-500/20"
            )}
          >
            <span className="h-[21px] flex items-center">
              {
                <interaction.icon
                  color={interaction.status?.isLiked ? "oklch(0.75 0.18 320)" : undefined}
                  fill={interaction.status?.isLiked ? "oklch(0.75 0.18 320)" : "transparent"}
                  strokeWidth={1}
                />
              }
            </span>
            <span className="min-w-[1ch] text-center mt-1">{interaction.status?.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default React.memo(PostInteractions);
