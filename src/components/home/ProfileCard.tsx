import { getProfile } from '@/app/api/profile/fetching';
import { Settings, User2Icon } from 'lucide-react';
import ProfileStats from '../profile/ProfileStats';
import getSession from '@/lib/getSession';

export default async function ProfileCard() {
  const session = await getSession();
  const profileResult = await getProfile({
    profileId: session.user.profile,
  });

  const { _count } = profileResult;

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
          <p className="font-['bold'] text-gray-600 dark:text-gray-100">
            {profileResult.firstName} {profileResult.lastName}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-400">
            @{profileResult.username}
          </p>
        </div>
      </div>

      <div className="top-seperator pt-2">
        <ProfileStats
          postsCount={_count.posts}
          followersCount={_count.followers}
          followingCount={_count.following}
        />
      </div>

      <nav className="mt-3 pt-3 top-seperator">
        {navs.map((item) => (
          <button
            key={item.label}
            className="cursor-pointer w-full px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm flex justify-between items-center">
              {item.label} {item.icon}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
