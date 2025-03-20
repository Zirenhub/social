'use client';

import { useState, useEffect } from 'react';
import { SearchIcon, Loader2 } from 'lucide-react';

type Props = {
  query: string | null;
};

export default function SearchResults({ query }: Props) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<string[]>([]);

  // Simulate fetching results
  useEffect(() => {
    if (!query) return;

    setLoading(true);

    // Simulate API call with timeout
    const timer = setTimeout(() => {
      // Example results
      setResults([
        `Result about "${query}" - Document 1`,
        `${query} related information - Document 2`,
        `Learn more about ${query} - Document 3`,
        `${query} advanced techniques - Document 4`,
        `${query} getting started guide - Document 5`,
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  if (!query) return null;

  return (
    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Search header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-700 dark:text-gray-200">
          Results for "
          <span className="text-cyan-500 dark:text-cyan-500">{query}</span>"
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {loading ? 'Searching...' : `${results.length} results`}
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-8 bg-white dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500 dark:text-cyan-500" />
        </div>
      ) : (
        /* Results list */
        <div className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {results.map((result, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer group"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 p-1 bg-gradient-to-br from-cyan-500 to-blue-500 rounded text-white">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-cyan-500 dark:group-hover:text-cyan-500 transition-colors duration-150">
                    {result}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm text-cyan-500 dark:text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium">
          View all results
        </button>
      </div>
    </div>
  );
}
