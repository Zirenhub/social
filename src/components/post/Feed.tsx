'use client';
import { SessionProvider } from 'next-auth/react';
import PostContainer from './PostContainer';
import Link from 'next/link';
import LoaderPlaceholder from '../ui/LoaderPlaceholder';
import useInfiniteScroll from '@/hooks/post/useInfiniteScroll';

type FeedProps = {
  showCreatePost?: boolean;
  filter: string;
  endpoint: string;
};

export default function Feed({
  showCreatePost = true,
  filter,
  endpoint,
}: FeedProps) {
  const {
    posts,
    error,
    isEmpty,
    isFetchingNextPage,
    isReachingEnd,
    sentinelRef,
    isLoading,
  } = useInfiniteScroll({
    endpoint,
    filter,
  });

  if (error) {
    console.error('Feed error:', error);
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-red-500">Error loading posts. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-12 w-full">
        <LoaderPlaceholder size={32} text="Loading posts..." />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-12 text-center flex flex-col bg-white rounded-xl shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">
          So empty here...
        </p>
        {showCreatePost && (
          <Link className="primary-button mx-auto mt-3" href="/create">
            Create a post
          </Link>
        )}
      </div>
    );
  }

  if (posts.length <= 0) {
    return null;
  }

  return (
    <main className="space-y-4">
      <SessionProvider>
        {posts.map((post) => (
          <PostContainer key={post.id} post={post} />
        ))}
      </SessionProvider>

      {/* Sentinel element for infinite loading */}
      <div
        ref={sentinelRef}
        className="flex justify-center py-4 my-2"
        data-testid="sentinel-element"
      >
        {isFetchingNextPage ? (
          <LoaderPlaceholder size={24} text="Loading more posts..." />
        ) : (
          isReachingEnd && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You've reached the end
            </p>
          )
        )}
      </div>
    </main>
  );
}
