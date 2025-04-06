import Filter from '@/components/ui/Filter';
import LoaderPlaceholder from '@/components/ui/LoaderPlaceholder';
import CreatePost from '@/components/ui/CreatePost';
import { HOME_PAGE_POSTS_FILTERS, homeFilters } from '@/types/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import getSession from '@/lib/getSession';
import { getHomePosts } from '@/app/api/posts/fetching';
import Feed from '@/components/post/Feed';

export const metadata: Metadata = {
  title: 'Home Feed',
  description: 'View your personalized feed',
};

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { filter } = await searchParams;

  const currentFilter =
    HOME_PAGE_POSTS_FILTERS.find((x) => x === filter) || 'forYou';
  const userProfileId = (await getSession()).user.profile;

  // Get initial posts for server-side rendering
  const initialPosts = await getHomePosts({
    filter: currentFilter,
    userProfileId,
  });

  return (
    <>
      {/* Main Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 mb-4">
        <h1 className="container-title text-2xl mb-6 tracking-tight ">
          Share your thoughts!
        </h1>
        <CreatePost />
      </div>
      {/* Feed Filter */}
      <Filter currentFilter={currentFilter} filters={homeFilters} />
      <Suspense
        key={currentFilter}
        fallback={
          <div className="flex items-center justify-center">
            <LoaderPlaceholder size={32} text="Loading posts..." />
          </div>
        }
      >
        <Feed
          endpoint="/api/posts"
          initialPosts={initialPosts}
          showCreatePost={currentFilter === 'forYou'}
          filter={currentFilter}
        />
      </Suspense>
    </>
  );
}
