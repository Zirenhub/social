'use client';
import { likePost } from '@/app/api/post/actions';
import { PostWithCounts } from '@/types/post';
import { HeartIcon, MessageCircleMoreIcon, RepeatIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  post: PostWithCounts;
};

export default function PostInteractions({ post }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const postIsLiked = post.likes.length > 0;

  const interactions = [
    {
      label: 'Like',
      icon: (
        <HeartIcon
          size={21}
          color={postIsLiked ? 'oklch(0.704 0.191 22.216)' : undefined}
          fill={postIsLiked ? 'oklch(0.704 0.191 22.216)' : 'transparent'}
        />
      ),
      count: post._count.likes,
      noClick: async () => {
        setIsLoading(true);
        const result = await likePost({ postId: post.id });
        if (!result.success || !result.data) {
          toast.error(
            `Something went wrong,
            ${result.error?.message || 'unknown'}`
          );
        }
        setIsLoading(false);
      },
    },
    {
      label: 'Comments',
      icon: <MessageCircleMoreIcon size={21} />,
      count: post._count.comments,
      noClick: () => toast.success(`Opening comments on post ${post.id}`),
    },
    {
      label: 'Share',
      icon: <RepeatIcon size={21} />,
      count: 0,
      noClick: () => toast.success(`Repost post ${post.id}`),
    },
  ];

  return (
    <div className="flex gap-4 text-gray-500 dark:text-gray-400 pt-3 top-seperator">
      {interactions.map((interaction) => {
        return (
          <button
            disabled={isLoading}
            key={interaction.label}
            onClick={interaction.noClick}
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
