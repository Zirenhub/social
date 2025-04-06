import Feed from '@/components/post/Feed';
import { getProfile, getProfileLastActive } from '@/app/api/profile/fetching';
import ProfileStats from '@/components/profile/ProfileStats';
import Follow from '@/components/profile/profile-interactions/Follow';
import Message from '@/components/profile/profile-interactions/Message';
import Filter from '@/components/ui/Filter';
import { PROFILE_PAGE_POSTS_FILTERS, profileFilters } from '@/types/constants';
import getSession from '@/lib/getSession';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfilePictureSection from '@/components/profile/ProfileAvatar';
import ProfileInfoSection from '@/components/profile/ProfileInfo';
import { getUser } from '@/app/api/auth/fetching';
import Sidebar from '@/components/profile/Sidebar';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
};

export default async function Profile({ params, searchParams }: Props) {
  const { slug } = await params;
  const { filter } = await searchParams;

  const currentFilter =
    PROFILE_PAGE_POSTS_FILTERS.find((x) => x === filter) || 'posts';
  const session = await getSession();
  const currentUser = await getUser(session.user.id);

  const [profileResult, profileActivity] = await Promise.all([
    getProfile({
      profileId: slug,
      userProfileId: currentUser.profile.id,
    }),
    getProfileLastActive(slug),
  ]);

  const isCurrentUser = currentUser.profile.id === profileResult.id;

  return (
    <div className="mx-14 mt-6">
      <ProfileHeader isCurrentUser={isCurrentUser} />

      <div className="max-w-5xl mx-auto -mt-24">
        <div className="flex gap-6 relative">
          <div className="md:w-2/3">
            <div className="relative mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <ProfilePictureSection
                profile={profileResult}
                isCurrentUser={isCurrentUser}
              />
              <ProfileInfoSection
                profile={profileResult}
                isCurrentUser={isCurrentUser}
              />

              <div className="flex justify-between top-seperator mt-3 pt-3 px-8 mb-3">
                <ProfileStats
                  postsCount={profileResult._count.posts}
                  followersCount={profileResult._count.followers}
                  followingCount={profileResult._count.following}
                />

                {!isCurrentUser && (
                  <div className="flex gap-4">
                    <Follow profileId={profileResult.id} />
                    <Message />
                  </div>
                )}
              </div>
            </div>

            <Filter currentFilter={currentFilter} filters={profileFilters} />

            <Feed
              filter={currentFilter}
              endpoint={`/api/profile/${profileResult.id}/posts`}
              showCreatePost={isCurrentUser && currentFilter === 'posts'}
            />
          </div>

          <div className="md:w-1/3">
            <Sidebar {...profileActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
