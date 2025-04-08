'use client';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import { CommentWithCounts } from '@/types/comment';

type CommentProps = {
  comment: CommentWithCounts;
};

export default function CommentContainer({ comment }: CommentProps) {
  const [isLiked, setIsLiked] = useState(comment.likes.length > 0);
  const [likeCount, setLikeCount] = useState(comment._count.likes || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleReply = () => {
    // Placeholder for reply action
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const isReply = Boolean(comment.parentId);

  return (
    <div
      className={`relative transition-all duration-300 ${isReply ? 'ml-10' : 'my-6'}`}
    >
      {isReply && (
        <div className="absolute -left-4 top-6 h-[calc(100%+16px)] w-0.5 bg-gradient-to-b from-[var(--color-cyan-500)] to-transparent opacity-20" />
      )}

      <div className="flex gap-4">
        <Avatar profile={comment.profile} />

        <div className="flex-1 space-y-3">
          <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-xl backdrop-blur-sm transition-all">
            <div className="flex justify-between px-4 pt-3">
              <div>
                <h3 className="font-semibold text-base leading-5 text-gray-800 dark:text-white">
                  {comment.profile.firstName} {comment.profile.lastName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{comment.profile.username} • {timeAgo}
                </p>
              </div>
            </div>

            <p className="px-4 pb-4 pt-2 text-sm text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 px-2 text-sm">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors font-medium ${
                isLiked
                  ? 'bg-[var(--color-magenta-500)]/10 text-[var(--color-magenta-500)]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[var(--color-magenta-500)] hover:bg-[var(--color-magenta-500)]/10'
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-200 ${
                  isLiked
                    ? 'fill-[var(--color-magenta-500)]'
                    : 'group-hover:fill-[var(--color-magenta-500)]/20'
                }`}
              />
              <span>{likeCount > 0 ? likeCount : 'Like'}</span>
            </button>

            <button
              onClick={handleReply}
              className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)]/10"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Reply</span>
            </button>

            <button className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-[var(--color-lime-500)] hover:bg-[var(--color-lime-500)]/10">
              <Share2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span>Share</span>
            </button>

            {comment._count.replies > 0 && (
              <div className="ml-auto flex items-center gap-2 rounded-full bg-[var(--color-blue-500)]/10 px-3 py-1.5 text-[var(--color-blue-500)] font-medium text-xs">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {comment._count.replies}{' '}
                  {comment._count.replies === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
