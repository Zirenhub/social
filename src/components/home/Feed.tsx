import { EllipsisVertical, User2Icon } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { getPosts } from '@/app/api/post/fetching';
import PostInteractions from '../post/PostInteractions';

type Props = {
  filter: string;
};

export default async function Feed({ filter }: Props) {
  const result = await getPosts(filter);

  if (!result.success || !result.data) {
    return <p>{result.error?.message}</p>;
  }

  return (
    <main>
      {/* Posts Feed */}
      {result.data.map((post) => (
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
            <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <EllipsisVertical />
            </button>
          </div>

          <p className="text-gray-800 dark:text-gray-200 mb-4">
            {post.content}
          </p>
          <PostInteractions post={post} />
        </div>
      ))}
      <div className="flex justify-center my-6">
        <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-[var(--color-cyan-500)] font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Load more posts
        </button>
      </div>
    </main>
  );
}
