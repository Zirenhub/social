'use client';

import { Loader2, SearchIcon, User2Icon } from 'lucide-react';
import { GetProfileType } from '@/types/profile';
import { useRouter } from 'next/navigation';
import ProfileHover from '../profile/ProfileHover';

type Props = {
  query: string;
  result: GetProfileType[];
};

export default function SearchResults({ query, result }: Props) {
  const router = useRouter();

  function handleNavigateToProfile(profileId: string) {
    router.push(`/profile/${profileId}`);
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Search header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink">
        <h3 className="font-medium text-gray-700 dark:text-gray-200 flex-grow w-0 flex text-nowrap">
          Results for "
          <span className="text-cyan-500 dark:text-cyan-500 truncate block w-full p-0 m-0">
            {query}"
          </span>
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {/*change to loading */}
          {result.length}
        </span>
      </div>
      {/* Loading state */}
      {false ? (
        <div className="flex justify-center items-center py-8 bg-white dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500 dark:text-cyan-500" />
        </div>
      ) : (
        /* Results list */
        <div className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {result.length > 0 ? (
            result.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleNavigateToProfile(profile.id)}
                className="relative px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer group rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  {/* Icon with gradient background */}
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white shadow-md">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                  {/* User avatar with gradient background */}
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full text-white shadow-md">
                    <User2Icon className="h-5 w-5" />
                  </div>
                  {/* User name with truncation */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-cyan-500 dark:group-hover:text-cyan-500 transition-colors duration-200 truncate">
                      {profile.firstName} {profile.lastName}
                    </p>
                    {/* Optional: Add a subtitle or description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {profile.location || 'Software Engineer'}
                    </p>
                    <ProfileHover profile={profile} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
      {/* Footer */}
      {result.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-cyan-500 dark:text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium">
            View all results
          </button>
        </div>
      )}
    </div>
  );
}
