'use client';
import { SearchIcon } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchInput() {
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
    <div className="relative">
      <input
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        maxLength={24}
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 input-text"
        defaultValue={searchParams.get('query')?.toString()}
      />
      <div className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
        <SearchIcon />
      </div>
    </div>
  );
}
