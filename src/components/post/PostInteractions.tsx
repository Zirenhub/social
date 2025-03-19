import { PostWithProfileAndCounts } from '@/types/post';
import { HeartIcon, MessageCircleMoreIcon, Share2Icon } from 'lucide-react';

type Props = {
  post: PostWithProfileAndCounts;
};

export default function PostInteractions({ post }: Props) {
  const interactions = [
    {
      label: 'Like',
      icon: <HeartIcon size={'full'} />,
      count: post._count.likes,
      noClick: () => console.log('like'),
    },
    {
      label: 'Comments',
      icon: <MessageCircleMoreIcon size={'full'} />,
      count: post._count.comments,
      noClick: () => console.log('comment'),
    },
    {
      label: 'Share',
      icon: <Share2Icon size={'full'} />,
      count: 0,
      noClick: () => console.log('share'),
    },
  ];

  return (
    <div className="flex gap-4 text-gray-500 dark:text-gray-400 pt-3 top-seperator">
      {interactions.map((interaction) => {
        return (
          <button
            key={interaction.label}
            className="cursor-pointer flex gap-1 items-center hover:text-[var(--color-cyan-500)] transition-colors h-9 w-9"
          >
            {interaction.icon}
            <span>{interaction.count}</span>
          </button>
        );
      })}
    </div>
  );
}
