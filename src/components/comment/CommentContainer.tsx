"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { formatCreatedAtDate } from "@/helpers/formatDate";
import useHover from "@/hooks/generic/useHover";
import useProfile from "@/hooks/profile/useProfile";
import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";
import ProfileHover from "../post/ProfileHover";
import Avatar from "../ui/Avatar";
import ProfileMeta from "../ui/ProfileMeta";
import CommentInteractions from "./CommentInteractions";
import CommentOptions from "./CommentOptions";

type CommentProps = {
  post: PostWithCounts;
  comment: CommentWithCounts;
  parents?: CommentWithCounts[];
  isRooted?: boolean;
  isFocused?: boolean;
  queryKey?: string[];
};

function CommentContainer({ post, comment, parents, isRooted, queryKey, isFocused }: CommentProps) {
  const router = useRouter();
  const { hover, showHover, hideHover } = useHover();
  const { profile: data, error, isLoading } = useProfile(comment.profileId, hover);
  const elementRef = useRef<HTMLDivElement>(null);

  // const isReply = Boolean(comment.parentId);

  const handleNavigateToProfile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    router.push(`/profile/${comment.profileId}`);
  };

  const handleNavigateToComment = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    router.push(`/comment/${comment.id}`);
  };

  useEffect(() => {
    if (isFocused) {
      elementRef.current?.scrollIntoView();
    }
  }, [isFocused]);

  return (
    <div className="relative transition-all duration-300 px-2" ref={elementRef}>
      {/* {isReply && (
        <div className="absolute -left-4 top-6 h-[calc(100%+16px)] w-0.5 bg-gradient-to-b from-[var(--color-cyan-500)] to-transparent opacity-20" />
        )} */}
      {hover && data && <ProfileHover profile={data} isLoading={isLoading} />}

      <div className="flex gap-3">
        <div className="relative">
          <div
            onMouseEnter={showHover}
            onMouseLeave={hideHover}
            onClick={handleNavigateToProfile}
            className="ring-2 ring-white outline-2 outline-blue-500/30 rounded-full"
          >
            <Avatar profile={comment.profile} />
          </div>
          {isRooted && (
            <div className="min-h-[200%] w-2 bg-gray-400 left-2/4 -translate-x-2/4 -top-12 -z-10 absolute" />
          )}
        </div>

        <div className="flex-1 md:space-y-3">
          <div
            onClick={handleNavigateToComment}
            className={clsx(
              "md:rounded-2xl md:border md:border-gray-200/60 md:shadow-xl md:backdrop-blur-sm md:transition-all md:hover:bg-gray-200/10 md:cursor-pointer",
              isFocused ? "bg-blue-500/10 p-2 md:p-0" : "md:dark:border-gray-700 md:bg-white/70 md:dark:bg-gray-800/60"
            )}
          >
            <div className="flex justify-between md:px-4 md:pt-3">
              <div
                onMouseEnter={showHover}
                onMouseLeave={hideHover}
                onClick={handleNavigateToProfile}
                className="md:cursor-pointer"
              >
                <ProfileMeta
                  profile={comment.profile}
                  createdAt={formatCreatedAtDate(comment.createdAt)}
                  type="comment"
                />
              </div>
              <CommentOptions comment={comment} postId={comment.postId} />
            </div>

            <p className="md:px-4 md:pb-2 pt-2 text-base text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>

          <CommentInteractions post={post} comment={comment} parents={parents} queryKey={queryKey} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CommentContainer);
