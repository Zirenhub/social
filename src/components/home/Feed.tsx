import { getPosts } from '@/app/api/post/fetching';
import PostContainer from '../post/PostContainer';

type Props = {
  filter: string;
};

export default async function Feed({ filter }: Props) {
  const result = await getPosts();

  if (!result.success || !result.data) {
    return <p>{result.error?.message}</p>;
  }

  return (
    <main>
      {/* Posts Feed */}
      {result.data.map((post) => (
        <PostContainer key={post.id} post={post} />
      ))}
      <div className="flex justify-center my-6">
        <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-[var(--color-cyan-500)] font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Load more posts
        </button>
      </div>
    </main>
  );
}
