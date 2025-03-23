import SearchResults from './SearchResults';
import SearchInput from './SearchInput';
import { getSearchProfiles } from '@/app/api/search/fetching';

type Props = {
  query?: string;
};

export default async function Search({ query }: Props) {
  const result = query ? await getSearchProfiles(query) : null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 relative">
        <SearchInput />
        {result?.error && <p>{result.error.message}</p>}
        {result?.data && query && (
          <SearchResults query={query} result={result.data} />
        )}
      </div>
    </>
  );
}
