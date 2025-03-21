import PostContainer from '../post/PostContainer';
import { PostWithProfileAndCounts } from '@/types/post';

type Props = {
  posts: PostWithProfileAndCounts[];
};

export default async function Feed({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">
          No posts yet
        </p>
        <button className="primary-button">Create a post</button>
      </div>
    );
  }

  return (
    <main>
      {/* Posts Feed */}
      {posts.map((post) => (
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
