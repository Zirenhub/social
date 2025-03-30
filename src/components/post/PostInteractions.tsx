'use client';
import useLike from '@/hooks/post/useLike';
import { PostWithCounts } from '@/types/post';
import { HeartIcon, MessageCircleMoreIcon, RepeatIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import LoaderPlaceholder from '../ui/LoaderPlaceholder';

type Props = {
  post: PostWithCounts;
};

export default function PostInteractions({ post }: Props) {
  const {
    postIsLiked,
    handleLike,
    isPending: likeIsPending,
  } = useLike({ post });

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
      noClick: handleLike,
      isPending: likeIsPending,
    },
    {
      label: 'Comments',
      icon: <MessageCircleMoreIcon size={21} />,
      count: post._count.comments,
      noClick: () => toast.success(`Opening comments on post ${post.id}`),
      isPending: false,
    },
    {
      label: 'Share',
      icon: <RepeatIcon size={21} />,
      count: 0,
      noClick: () => toast.success(`Repost post ${post.id}`),
      isPending: false,
    },
  ];

  return (
    <div className="flex gap-4 text-gray-500 dark:text-gray-400 pt-3 top-seperator">
      {interactions.map((interaction) => {
        return (
          <button
            disabled={interaction.isPending}
            key={interaction.label}
            onClick={interaction.noClick}
            className="cursor-pointer flex items-center gap-1 hover:text-[var(--color-cyan-500)] transition-colors h-9"
          >
            <span className="h-[21px] flex items-center">
              {interaction.isPending ? <LoaderPlaceholder /> : interaction.icon}
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
