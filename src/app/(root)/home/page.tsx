import { getHomePosts } from '@/app/api/post/fetching';
import Filter from '@/components/ui/Filter';
import Feed from '@/components/post/Feed';
import Notifications from '@/components/home/Notifications';
import ProfileCard from '@/components/home/ProfileCard';
import Sidebar from '@/components/home/Sidebar';
import LoaderPlaceholder from '@/components/ui/LoaderPlaceholder';
import CreatePost from '@/components/ui/CreatePost';
import { HOME_PAGE_POSTS_FILTERS, homeFilters } from '@/types/constants';
import { Metadata } from 'next';
import { Suspense } from 'react';
import getSession from '@/lib/getSession';

export const metadata: Metadata = {
  title: 'Home Feed',
  description: 'View your personalized feed',
};

type Props = {
  searchParams: Promise<{ filter?: string; query?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { filter, query } = await searchParams;

  const getCurrentFilter = () => {
    const matchingFilter = HOME_PAGE_POSTS_FILTERS.find((x) => x === filter);
    if (matchingFilter) {
      return matchingFilter;
    } else {
      return 'forYou';
    }
  };
  const session = await getSession();
  const { posts } = await getHomePosts({
    filter: getCurrentFilter(),
    userProfileId: session.user.profile,
  });

  return (
    <div className="flex items-start text-lg justify-between mx-14 pr-[72px]">
      {/* Left Sidebar */}
      <aside className="hidden xl:flex flex-col gap-3 sticky top-4 h-[calc(100vh-2rem)] flex-shrink 2xl:flex-1 items-start">
        <ProfileCard />
        <Notifications />
      </aside>

      {/* Main Feed */}
      <div className="mt-4 flex flex-col not-2xl:w-[90%] not-2xl:ml-18 2xl:min-w-1/3 2xl:w-[600px] justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 mb-4">
          <h1 className="container-title text-2xl mb-6 tracking-tight ">
            Share your thoughts!
          </h1>
          <CreatePost />
        </div>
        {/* Feed Filter */}
        <Filter currentFilter={getCurrentFilter()} filters={homeFilters} />
        <Suspense
          key={getCurrentFilter()}
          fallback={
            <div className="flex items-center justify-center">
              <LoaderPlaceholder size={32} text="Loading posts..." />
            </div>
          }
        >
          <Feed
            posts={posts}
            showCreatePost={getCurrentFilter() === 'forYou'}
          />
        </Suspense>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden 2xl:flex justify-end mt-4 sticky top-4 flex-1">
        <div className="w-76">
          <Sidebar query={query} />
        </div>
      </aside>
    </div>
  );
}
