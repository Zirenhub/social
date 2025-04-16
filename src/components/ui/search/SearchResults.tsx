"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, SearchIcon, User2Icon } from "lucide-react";

import { fetcher } from "@/lib/fetcher";
import { CACHE_TAGS } from "@/types/constants";
import { GetProfileType } from "@/types/profile";

type Props = {
  query: string;
};

export default function SearchResults({ query }: Props) {
  const {
    data: results,
    isLoading,
    error,
  } = useQuery<GetProfileType[]>({
    queryKey: [CACHE_TAGS.SEARCH(query)],
    queryFn: () => fetcher(`/api/search?query=${query}`),
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white dark:bg-gray-800">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-cyan-500">
            <SearchIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 bg-red-50 dark:bg-red-900/20 rounded-full">
          <div className="text-red-500 dark:text-red-400">
            <SearchIcon className="w-6 h-6" />
          </div>
        </div>
        <p className="text-red-500 dark:text-red-400 font-medium">Failed to load results</p>
      </div>
    );

  if (!results || results.length === 0)
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 bg-gray-50 dark:bg-gray-800 rounded-full">
          <div className="text-gray-400 dark:text-gray-500">
            <SearchIcon className="w-6 h-6" />
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No results for "{query}"</p>
      </div>
    );

  return (
    <div className="rounded-b-lg overflow-hidden">
      {/* Search header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span className="text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500">Results</span>
          <span className="text-cyan-500 dark:text-cyan-500 font-semibold truncate max-w-48">"{query}"</span>
        </h3>
        <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 text-xs font-medium rounded-full">
          {results.length}
        </span>
      </div>

      {/* Results list */}
      <motion.div
        className="bg-white dark:bg-gray-900/40 divide-y divide-gray-50 dark:divide-gray-800/50"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {results.map((profile) => (
          <motion.div key={profile.id} variants={item}>
            <Link
              href={`/profile/${profile.id}`}
              className="block px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar with gradient background */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-magenta-500 to-purple-500 flex items-center justify-center shadow-md">
                    <User2Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center shadow-sm">
                    <SearchIcon className="h-3 w-3 text-white" />
                  </div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-gray-100 font-semibold group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-200">
                    {profile.firstName} {profile.lastName}
                  </p>
                  {profile.location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 mr-1.5"></span>
                      {profile.location}
                    </p>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className="text-gray-300 dark:text-gray-700">
                  <ArrowRight stroke="currentColor" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
          <button className="inline-flex items-center gap-1.5 text-sm text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium transition-colors">
            View all results
            <ArrowRight stroke="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}
