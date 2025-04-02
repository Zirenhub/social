import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  currentFilter: string;
  filters: { label: string; url: string; icon?: LucideIcon }[];
};

export default function Filter({ currentFilter, filters }: Props) {
  const getFilterUrl = (filter: string) => {
    return `?filter=${filter}`;
  };

  return (
    <div className="flex mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      {filters.map((filter) => {
        return (
          <Link
            href={getFilterUrl(filter.url)}
            key={filter.label}
            className={`flex-1 py-2 flex items-center justify-center font-medium text-center ${
              currentFilter === filter.url
                ? 'text-[var(--color-cyan-500)] border-b-2 border-[var(--color-cyan-500)] pointer-events-none '
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {filter.icon && <filter.icon size={18} />}
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
