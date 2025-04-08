'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import useLike from '@/hooks/post/useLike';
import type { PostWithCounts } from '@/types/post';
import { HeartIcon, MessageCircleMoreIcon, RepeatIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function formatCount(count: number) {
  if (count < 1000) {
    return `${count}`;
  }
  if (count >= 1000 && count < 10000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return `${Math.floor(count / 1000)}k`;
}

type Props = {
  post: PostWithCounts;
};

export default function PostInteractions({ post }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const { isPending, handleLike, likesStatus } = useLike({
    post,
    initialIsLiked: post.likes.length > 0,
    initialLikeCount: post._count.likes,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedLikesCount = useMemo(
    () => formatCount(likesStatus.count),
    [likesStatus.count]
  );

  const formattedCommentsCount = useMemo(
    () => formatCount(post._count.comments),
    [post._count.comments]
  );

  const handleCommentClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      router.push(`/post/${post.id}`);
    },
    [post.id]
  );

  const handleShareClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      toast.success(`Repost post ${post.id}`);
    },
    [post.id]
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
        label: 'Like',
        icon: HeartIcon,
        status: likesStatus,
        onClick: handleLikeClick,
        isPending: isPending,
      },
      {
        label: 'Comments',
        icon: MessageCircleMoreIcon,
        status: { isLiked: false, count: post._count.comments },
        onClick: handleCommentClick,
        isPending: false,
      },
      {
        label: 'Share',
        icon: RepeatIcon,
        status: { isLiked: false, count: 0 },
        onClick: handleShareClick,
        isPending: false,
      },
    ],
    [
      isClient,
      likesStatus.isLiked,
      formattedLikesCount,
      formattedCommentsCount,
      handleLikeClick,
      handleCommentClick,
      handleShareClick,
      isPending,
    ]
  );

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
    <div className="flex gap-4 text-gray-500 dark:text-gray-400 p-2 top-seperator">
      {interactions.map((interaction) => {
        return (
          <button
            disabled={interaction.isPending}
            key={interaction.label}
            onClick={(e) => interaction.onClick(e)}
            className={`cursor-pointer rounded-full flex items-center gap-1 hover:text-magenta-500 transition-colors px-2 hover:bg-magenta-500/20 ${interaction.status.isLiked ? 'bg-magenta-500/20' : ''}`}
          >
            <span className="h-[21px] flex items-center">
              {
                <interaction.icon
                  color={
                    interaction.status?.isLiked
                      ? 'oklch(0.75 0.18 320)'
                      : undefined
                  }
                  fill={
                    interaction.status?.isLiked
                      ? 'oklch(0.75 0.18 320)'
                      : 'transparent'
                  }
                />
              }
            </span>
            <span className="min-w-[1ch] text-center mt-1">
              {interaction.status?.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
