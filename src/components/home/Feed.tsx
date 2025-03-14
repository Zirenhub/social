import { getPosts } from '@/app/api/post/fetching';
import PostContainer from '../post/PostContainer';

type Props = {
  filter: string;
};

export default async function Feed({ filter }: Props) {
  const result = await getPosts({ filter });

  if (!result.success || !result.data) {
    return <p>{result.error?.message}</p>;
  }

  if (result.data.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">
          No posts yet
        </p>
        <button className="px-6 py-3 mt-4 text-white rounded-lg bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] hover:from-[var(--color-cyan-500)]/90 hover:to-[var(--color-blue-500)]/90 transition-colors shadow-md hover:shadow-lg">
          Create a post
        </button>
      </div>
    );
  }

  return (
    <main>
      {/* Posts Feed */}
      {result.data.map((post) => (
        <PostContainer key={post.id} post={post} />
      ))}
      <div className="flex justify-center">
        <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-[var(--color-cyan-500)] font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Load more posts
        </button>
      </div>
    </main>
  );
}
