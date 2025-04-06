'use client';
import { SearchIcon } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-20 transition-opacity duration-300 ${isFocused ? 'opacity-30' : 'opacity-10'}`}
      ></div>
      <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl m-[1px]"></div>

      <div className="relative">
        <input
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={24}
          type="text"
          placeholder="Search..."
          className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          defaultValue={searchParams.get('query')?.toString()}
        />

        <div
          className={`w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-cyan-500 dark:text-cyan-500' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <SearchIcon strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
