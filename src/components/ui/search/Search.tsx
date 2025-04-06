'use client';
import { useSearchParams } from 'next/navigation';
import SearchResults from './SearchResults';
import SearchInput from './SearchInput';

export default function Search() {
  const searchParams = useSearchParams();
  const search = searchParams.get('query');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="p-4">
        <SearchInput />
      </div>
      {search && <SearchResults query={search} />}
    </div>
  );
}
