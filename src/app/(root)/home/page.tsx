import Feed from '@/components/home/Feed';
import Notifications from '@/components/home/Notifications';
import ProfileCard from '@/components/home/ProfileCard';
import Sidebar from '@/components/home/Sidebar';
import LoaderPlaceholder from '@/components/loader/LoaderPlaceholder';
import CreatePost from '@/components/post/CreatePost';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Home Feed',
  description: 'View your personalized feed',
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter: string | undefined }>;
}) {
  const filters = [
    { label: 'For You', url: 'forYou' },
    { label: 'Friends', url: 'friends' },
    { label: 'Trending', url: 'trending' },
  ];

  const getFilterUrl = (filter: string) => {
    return `?filter=${filter}`;
  };

  const currentFilter = (await searchParams).filter || 'forYou';

  return (
    <div className="flex items-start text-lg justify-between mx-14">
      {/* Left Sidebar */}
      <aside className="hidden xl:flex flex-col gap-3 sticky top-4 h-[calc(100vh-2rem)] flex-shrink 2xl:flex-1 items-start">
        <ProfileCard />
        <Notifications />
      </aside>

      {/* Main Feed */}
      <div className="mt-4 flex flex-col not-2xl:w-[90%] not-2xl:ml-18 2xl:min-w-1/3 2xl:w-[600px] justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] bg-clip-text text-transparent mb-6 tracking-tight ">
            Share your thoughts!
          </h1>
          <CreatePost />
        </div>
        {/* Feed Filter */}
        <div className="flex mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-0 z-20">
          {filters.map((filter) => {
            return (
              <Link
                href={getFilterUrl(filter.url)}
                key={filter.label}
                className={`flex-1 py-2 font-medium text-center ${
                  currentFilter === filter.url
                    ? 'text-[var(--color-cyan-500)] border-b-2 border-[var(--color-cyan-500)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
        <Suspense
          key={currentFilter}
          fallback={
            <div className="flex items-center justify-center">
              <LoaderPlaceholder size={32} text="Loading posts..." />
            </div>
          }
        >
          <Feed filter={currentFilter} />
        </Suspense>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden 2xl:flex justify-end mt-4 sticky top-4 flex-1">
        <div className="w-76">
          <Sidebar />
        </div>
      </aside>
    </div>
  );
}
