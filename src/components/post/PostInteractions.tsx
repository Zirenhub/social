'use client';
import { useState, useEffect } from 'react';
import useLike from '@/hooks/post/useLike';
import type { PostWithCounts } from '@/types/post';
import { HeartIcon, MessageCircleMoreIcon, RepeatIcon } from 'lucide-react';
import { toast } from 'react-toastify';

type Props = {
  post: PostWithCounts;
};

export default function PostInteractions({ post }: Props) {
  const [isClient, setIsClient] = useState(false);
  const { isPending, handleLike, likesStatus } = useLike({
    post,
    initialIsLiked: post.likes.length > 0,
    initialLikeCount: post._count.likes,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const interactions = [
    {
      label: 'Like',
      icon: (
        <HeartIcon
          size={21}
          color={
            isClient && likesStatus.isLiked
              ? 'oklch(0.704 0.191 22.216)'
              : undefined
          }
          fill={
            isClient && likesStatus.isLiked
              ? 'oklch(0.704 0.191 22.216)'
              : 'transparent'
          }
        />
      ),
      count: likesStatus.count,
      onClick: handleLike,
      isPending: isPending,
    },
    {
      label: 'Comments',
      icon: <MessageCircleMoreIcon size={21} />,
      count: post._count.comments,
      onClick: () => toast.success(`Opening comments on post ${post.id}`),
      isPending: false,
    },
    {
      label: 'Share',
      icon: <RepeatIcon size={21} />,
      count: 0,
      onClick: () => toast.success(`Repost post ${post.id}`),
      isPending: false,
    },
  ];

  // Placeholder component when isClient is false
  if (!isClient) {
    return (
      <div className="flex gap-4 text-gray-500 dark:text-gray-400 pt-3 top-seperator">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex items-center gap-1 h-9 animate-pulse"
          >
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 text-gray-500 dark:text-gray-400 pt-3 top-seperator">
      {interactions.map((interaction) => {
        return (
          <button
            disabled={interaction.isPending}
            key={interaction.label}
            onClick={(e) => {
              e.stopPropagation();
              interaction.onClick();
            }}
            className="cursor-pointer flex items-center gap-1 hover:text-[var(--color-cyan-500)] transition-colors h-9"
          >
            <span className="h-[21px] flex items-center">
              {interaction.icon}
            </span>
            <span className="min-w-[1ch] text-center mt-1">
              {interaction.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
