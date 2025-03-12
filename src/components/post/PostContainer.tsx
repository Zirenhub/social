import { PostWithProfileAndCounts } from '@/types/post';
import { formatDistance } from 'date-fns';
import { User2Icon } from 'lucide-react';
import PostOptions from './PostOptions';
import PostInteractions from './PostInteractions';
import { getUser } from '@/lib/session';

type Props = {
  post: PostWithProfileAndCounts;
};

export default async function PostContainer({ post }: Props) {
  const user = await getUser();

  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex items-start mb-3">
        <div className="w-10 h-10 rounded-full mr-3 border-2 border-gray-400">
          <User2Icon size={'full'} color="gray" />
        </div>
        <div>
          <h3 className="font-['bold'] text-gray-800 dark:text-gray-100">
            {post.profile.firstName} {post.profile.lastName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistance(post.createdAt, new Date(), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </p>
        </div>
        <PostOptions
          post={post}
          isOwner={post.profile.id === user.profile.id}
        />
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
      <PostInteractions post={post} />
    </div>
  );
}
