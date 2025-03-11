import { SearchIcon } from 'lucide-react';

export default function Sidebar() {
  // Sample trending topics
  const trendingTopics = [
    { topic: 'Technology', posts: '1.2K' },
    { topic: 'Sports', posts: '856' },
    { topic: 'Music', posts: '673' },
    { topic: 'Travel', posts: '542' },
    { topic: 'Food', posts: '489' },
  ];

  // Sample suggested connections
  const suggestedConnections = [
    { name: 'Taylor Reed', mutual: 12 },
    { name: 'Jordan Brown', mutual: 8 },
    { name: 'Riley Smith', mutual: 5 },
  ];

  return (
    <div className="sticky top-4 w-72 overflow-auto h-screen">
      {/* Search Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-[var(--color-cyan-500)] focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
          />
          <div className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
          Trending Topics
        </h3>
        {trendingTopics.map((item, index) => (
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
        <button className="w-full text-[var(--color-cyan-500)] text-sm font-medium mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          Show more
        </button>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
          People You May Know
        </h3>
        {suggestedConnections.map((person, index) => (
          <div
            key={index}
            className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-purple-500)] to-[var(--color-cyan-500)] mr-3"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {person.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {person.mutual} mutual connections
              </p>
            </div>
            <button className="ml-auto text-sm font-medium text-[var(--color-cyan-500)] hover:text-[var(--color-blue-500)] transition-colors">
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-500 dark:text-gray-400 px-4">
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
