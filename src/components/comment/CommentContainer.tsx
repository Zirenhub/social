"use client";

import { formatCreatedAtDate } from "@/helpers/formatDate";
import { CommentWithCounts } from "@/types/comment";
import Avatar from "../ui/Avatar";
import ProfileMeta from "../ui/ProfileMeta";
import CommentInteractions from "./CommentInteractions";
import CommentOptions from "./CommentOptions";

type CommentProps = {
  comment: CommentWithCounts;
  queryKey: string[];
};

export default function CommentContainer({ comment, queryKey }: CommentProps) {
  const isReply = Boolean(comment.parentId);

  return (
    <div className={`relative transition-all duration-300 ${isReply ? "ml-10" : "my-6"}`}>
      {isReply && (
        <div className="absolute -left-4 top-6 h-[calc(100%+16px)] w-0.5 bg-gradient-to-b from-[var(--color-cyan-500)] to-transparent opacity-20" />
      )}

      <div className="flex gap-4">
        <Avatar profile={comment.profile} />

        <div className="flex-1 space-y-3">
          <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-xl backdrop-blur-sm transition-all">
            <div className="flex justify-between px-4 pt-3">
              <ProfileMeta profile={comment.profile} createdAt={formatCreatedAtDate(comment.createdAt)} />
              <CommentOptions comment={comment} postId={comment.postId} />
            </div>

            <p className="px-4 pb-4 pt-2 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>

          <CommentInteractions comment={comment} queryKey={queryKey} />
        </div>
      </div>
    </div>
  );
}
