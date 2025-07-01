"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { formatCreatedAtDate } from "@/helpers/formatDate";
import useHover from "@/hooks/generic/useHover";
import useProfile from "@/hooks/profile/useProfile";
import type { CommentWithCounts } from "@/types/comment";
import type { PostWithCounts } from "@/types/post";
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
  queryKey?: string;
};

const CommentContainer = React.memo<CommentProps>(
  ({ post, comment, parents, isRooted, queryKey, isFocused }) => {
    const router = useRouter();
    const { hover, showHover, hideHover } = useHover();
    const { profile: data, error, isLoading } = useProfile(comment.profileId, hover);
    const elementRef = useRef<HTMLDivElement>(null);
    const hasScrolledRef = useRef(false);

    const handleNavigateToProfile = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        router.push(`/profile/${comment.profileId}`);
      },
      [router, comment.profileId]
    );

    const handleNavigateToComment = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        router.push(`/comment/${comment.id}`);
      },
      [router, comment.id]
    );

    const formattedDate = useMemo(() => formatCreatedAtDate(comment.createdAt), [comment.createdAt]);

    const containerClassName = useMemo(
      () =>
        clsx(
          "rounded-2xl md:border md:border-gray-200/60 md:shadow-xl md:backdrop-blur-sm md:transition-all md:hover:bg-gray-200/10 md:cursor-pointer",
          isFocused ? "bg-blue-500/10 p-2 md:p-0" : "dark:border-gray-700 bg-white/70 dark:bg-gray-800/60"
        ),
      [isFocused]
    );

    useEffect(() => {
      if (isFocused && !hasScrolledRef.current && elementRef.current) {
        requestAnimationFrame(() => {
          elementRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          hasScrolledRef.current = true;
        });
      }

      if (!isFocused) {
        hasScrolledRef.current = false;
      }
    }, [isFocused]);

    return (
      <div className="relative transition-all duration-300 px-2" ref={elementRef}>
        {hover && data && <ProfileHover profile={data} isLoading={isLoading} />}

        <div className="flex gap-3">
          <div className="relative">
            <div
              onMouseEnter={showHover}
              onMouseLeave={hideHover}
              onClick={handleNavigateToProfile}
              className="ring-2 ring-white outline-2 outline-blue-500/30 rounded-full cursor-pointer"
            >
              <Avatar profile={comment.profile} />
            </div>
            {isRooted && (
              <div className="min-h-[200%] w-2 bg-gray-400 left-2/4 -translate-x-2/4 -top-12 -z-10 absolute" />
            )}
          </div>

          <div className="flex-1 space-y-1 md:space-y-3 border-b-2 border-gray-200 pb-2 md:border-b-0">
            <div onClick={handleNavigateToComment} className={containerClassName}>
              <div className="flex justify-between md:px-4 md:pt-3">
                <div
                  onMouseEnter={showHover}
                  onMouseLeave={hideHover}
                  onClick={handleNavigateToProfile}
                  className="md:cursor-pointer"
                >
                  <ProfileMeta profile={comment.profile} createdAt={formattedDate} type="comment" />
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.comment.id === nextProps.comment.id &&
      prevProps.comment._count.likes === nextProps.comment._count.likes &&
      prevProps.comment._count.replies === nextProps.comment._count.replies &&
      prevProps.isFocused === nextProps.isFocused &&
      prevProps.isRooted === nextProps.isRooted &&
      prevProps.queryKey === nextProps.queryKey &&
      JSON.stringify(prevProps.parents?.map((p) => p.id)) === JSON.stringify(nextProps.parents?.map((p) => p.id))
    );
  }
);

CommentContainer.displayName = "CommentContainer";

export default CommentContainer;
