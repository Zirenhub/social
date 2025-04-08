'use client';
import { Heart, MessageSquare, Share2, Flag } from 'lucide-react';
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
    // if (onLike) {
    //   onLike(comment.id);
    // }
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleReply = () => {
    // if (onReply) {
    //   onReply(comment.id);
    // }
  };

  // Calculate how long ago the comment was posted
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  // Determine if this is a reply to another comment
  const isReply = Boolean(comment.parentId);

  return (
    <div
      className={`relative transition-all duration-300 ${isReply ? 'ml-8' : 'my-4'}`}
    >
      {/* Thread line for replies */}
      {isReply && (
        <div className="absolute -left-4 top-5 h-[calc(100%+16px)] w-0.5 bg-gradient-to-b from-[var(--color-cyan-500)] to-transparent opacity-30"></div>
      )}

      <div className="flex gap-3">
        <Avatar profile={comment.profile} />

        {/* Comment content */}
        <div className="flex-1 space-y-2">
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all duration-300 dark:from-gray-800 dark:to-gray-850">
            {/* Username and time */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {comment.profile.firstName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo}
                </span>
              </div>

              {/* Only show flag button on hover for cleaner UI */}
              {/* {isHovered && (
              <button className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[var(--color-magenta-500)] dark:hover:bg-gray-700">
                <Flag className="h-3.5 w-3.5" />
              </button>
            )} */}
            </div>

            {/* Comment text */}
            <p className="text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>
          </div>

          {/* Comment actions */}
          <div className="flex flex-wrap items-center gap-4 px-1 text-xs">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-1.5 rounded-full px-2 py-1 transition-all ${
                isLiked
                  ? 'bg-[var(--color-magenta-500)]/10 text-[var(--color-magenta-500)]'
                  : 'hover:bg-[var(--color-magenta-500)]/10 hover:text-[var(--color-magenta-500)] dark:text-gray-400'
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all ${
                  isLiked
                    ? 'fill-[var(--color-magenta-500)]'
                    : 'group-hover:fill-[var(--color-magenta-500)]/20'
                }`}
              />
              <span>{likeCount > 0 ? likeCount : 'Like'}</span>
            </button>

            <button
              onClick={handleReply}
              className="group flex items-center gap-1.5 rounded-full px-2 py-1 text-gray-500 transition-all hover:bg-[var(--color-cyan-500)]/10 hover:text-[var(--color-cyan-500)] dark:text-gray-400"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>

            {/* Share button with animation on hover */}
            <button className="group flex items-center gap-1.5 rounded-full px-2 py-1 text-gray-500 transition-all hover:bg-[var(--color-lime-500)]/10 hover:text-[var(--color-lime-500)] dark:text-gray-400">
              <Share2 className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
              <span>Share</span>
            </button>

            {comment._count.replies > 0 && (
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--color-blue-500)]/10 px-2 py-1 text-[var(--color-blue-500)]">
                <MessageSquare className="h-3.5 w-3.5" />
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
