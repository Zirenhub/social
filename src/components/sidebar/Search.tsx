'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import SearchResults from './SearchResults';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 relative">
        <div className="relative">
          <input
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 input-text"
            defaultValue={searchParams.get('query')?.toString()}
          />
          <div className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
            <SearchIcon />
          </div>
        </div>
        <SearchResults query={searchParams.get('query')} />
      </div>
    </>
  );
}
