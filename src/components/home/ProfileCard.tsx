import { getPostsCount } from '@/app/api/profile/fetching';
import { getUser } from '@/lib/session';
import { Settings, User2Icon } from 'lucide-react';

export default async function ProfileCard() {
  const user = await getUser();

  const postsCount = await getPostsCount(user.profile.id);

  const navs = [
    { label: 'Settings', icon: <Settings size={16} color="gray" /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4 gap-2">
        <div className="p-2 border-2 border-gray-400 rounded-full">
          <User2Icon size={32} color="gray" />
        </div>
        <div className="mb-1">
          <p className="font-semibold text-gray-600 dark:text-gray-100">
            {user.profile.firstName} {user.profile.lastName}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-400">
            @{user.profile.username}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center py-2 border-t border-b border-gray-200 dark:border-gray-700 mb-4">
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">
            {postsCount.data}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">12.4k</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">567</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
        </div>
      </div>

      <nav>
        {navs.map((item) => (
          <button
            key={item.label}
            className="cursor-pointer w-full px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm flex justify-between items-center font-medium">
              {item.label} {item.icon}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
