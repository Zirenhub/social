'use client';
import { useRef } from 'react';
import MightKnow from '../ui/MightKnow';
import Search from '../ui/search/Search';
import useSyncScroll from '@/hooks/useSyncScroll';

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useSyncScroll(sidebarRef);

  return (
    <div
      ref={sidebarRef}
      className="overflow-y-scroll flex flex-col gap-3 no-scrollbar h-screen py-4"
    >
      {/* Search Box */}
      <Search />

      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 mt-3">
        <h3 className="container-title mb-4">Trending Topics</h3>
        {[
          { topic: 'Technology', posts: '1.2K' },
          { topic: 'Sports', posts: '856' },
          { topic: 'Music', posts: '673' },
          { topic: 'Travel', posts: '542' },
          { topic: 'Food', posts: '489' },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--color-cyan-500)] bg-opacity-10 text-[var(--color-cyan-500)] text-xs font-bold mr-3">
                {index + 1}
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {item.topic}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.posts} posts
            </span>
          </div>
        ))}
        <button className="w-full text-[var(--color-cyan-500)] text-sm font-medium mt-2 pt-2 top-seperator">
          Show more
        </button>
      </div>

      {/* Suggested Connections */}
      <MightKnow />

      {/* Footer Links */}
      <div className="text-xs text-gray-500 dark:text-gray-400 px-4 mt-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
          {[
            'About',
            'Help Center',
            'Privacy',
            'Terms',
            'Cookies',
            'Advertising',
            'Jobs',
            'Settings',
          ].map((link, index) => (
            <a key={index} href="#" className="hover:underline">
              {link}
            </a>
          ))}
        </div>
        <p>© 2025 YourApp Corporation</p>
      </div>
    </div>
  );
}
