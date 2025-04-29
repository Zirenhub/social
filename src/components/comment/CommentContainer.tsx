"use client";

import { useRouter } from "next/navigation";

import { formatCreatedAtDate } from "@/helpers/formatDate";
import useHover from "@/hooks/generic/useHover";
import useProfile from "@/hooks/profile/useProfile";
import { CommentWithCounts } from "@/types/comment";
import ProfileHover from "../post/ProfileHover";
import Avatar from "../ui/Avatar";
import ProfileMeta from "../ui/ProfileMeta";
import CommentInteractions from "./CommentInteractions";
import CommentOptions from "./CommentOptions";

type CommentProps = {
  comment: CommentWithCounts;
  queryKey: string[];
};

export default function CommentContainer({ comment, queryKey }: CommentProps) {
  const router = useRouter();
  const { hover, showHover, hideHover } = useHover();
  const { profile: data, error, isLoading } = useProfile(comment.profileId, hover);

  const isReply = Boolean(comment.parentId);

  const handleNavigateToProfile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    router.push(`/profile/${comment.profileId}`);
  };

  const handleNavigateToComment = () => {
    console.log("Navigate to comment");
  };

  return (
    <div
      onClick={handleNavigateToComment}
      className={`relative transition-all cursor-pointer duration-300 ${isReply ? "ml-10" : "my-6"}`}
    >
      {isReply && (
        <div className="absolute -left-4 top-6 h-[calc(100%+16px)] w-0.5 bg-gradient-to-b from-[var(--color-cyan-500)] to-transparent opacity-20" />
      )}
      {hover && data && <ProfileHover profile={data} isLoading={isLoading} />}

      <div className="flex gap-3">
        <div onMouseEnter={showHover} onMouseLeave={hideHover} onClick={(e) => handleNavigateToProfile(e)}>
          <Avatar profile={comment.profile} />
        </div>

        <div className="flex-1 space-y-3">
          <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-xl backdrop-blur-sm transition-all hover:bg-gray-200/10">
            <div className="flex justify-between px-4 pt-3">
              <div
                onMouseEnter={showHover}
                onMouseLeave={hideHover}
                onClick={(e) => handleNavigateToProfile(e)}
                className="cursor-pointer"
              >
                <ProfileMeta
                  profile={comment.profile}
                  createdAt={formatCreatedAtDate(comment.createdAt)}
                  type="comment"
                />
              </div>
              <CommentOptions comment={comment} postId={comment.postId} />
            </div>

            <p className="px-4 pb-4 pt-2 text-base text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>

          <CommentInteractions comment={comment} queryKey={queryKey} />
        </div>
      </div>
    </div>
  );
}
