import { getProfile } from '@/app/api/profile/fetching';
import ProfileStats from '../profile/ProfileStats';
import getSession from '@/lib/getSession';
import Avatar from '../ui/Avatar';
import OnlineIndicator from '../ui/OnlineIndicator';

export default async function ProfileCard() {
  const session = await getSession();
  const profileResult = await getProfile({
    profileId: session.user.profile,
    userProfileId: session.user.profile,
  });
  const { _count } = profileResult;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar
            profile={profileResult}
            className="h-16 w-16 rounded-full ring-2 ring-cyan-500 dark:ring-cyan-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
          />
          <OnlineIndicator className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            {profileResult.firstName} {profileResult.lastName}
          </h3>
          <p className="text-sm text-cyan-500 dark:text-cyan-400 font-medium">
            @{profileResult.username}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <ProfileStats
          postsCount={_count.posts}
          followersCount={_count.followers}
          followingCount={_count.following}
        />
      </div>
    </div>
  );
}
