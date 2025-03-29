import MightKnow from '@/components/ui/MightKnow';
import ActivitySummary from '@/components/profile/ActivitySummary';
import Feed from '@/components/post/Feed';
import {
  getProfile,
  getProfileLastActive,
  getProfilePosts,
} from '@/app/api/profile/fetching';
import ProfileStats from '@/components/profile/ProfileStats';
import Follow from '@/components/profile/profile-interactions/Follow';
import Message from '@/components/profile/profile-interactions/Message';
import Filter from '@/components/ui/Filter';
import { PROFILE_PAGE_POSTS_FILTERS, profileFilters } from '@/types/constants';
import Search from '@/components/ui/search/Search';
import { GetUser } from '@/app/api/auth/fetching';
import getSession from '@/lib/getSession';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfilePictureSection from '@/components/profile/ProfileAvatar';
import ProfileInfoSection from '@/components/profile/ProfileInfo';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string; query?: string }>;
};

const getCurrentFilter = (filter: string | undefined) => {
  const matchingFilter = PROFILE_PAGE_POSTS_FILTERS.find((x) => x === filter);
  return matchingFilter || 'post';
};

export default async function Profile({ params, searchParams }: Props) {
  const { slug } = await params;
  const { filter, query } = await searchParams;

  const session = await getSession();
  const currentUser = await GetUser(session.user.id);

  const [profileResult, profilePosts, profileLastActive] = await Promise.all([
    getProfile({
      profileId: slug,
      userProfileId: currentUser.profile.id,
    }),
    getProfilePosts({
      profileId: slug,
      userProfileId: currentUser.profile.id,
    }),
    getProfileLastActive(slug),
  ]);

  const result = {
    ...profileResult,
    posts: profilePosts,
    lastActive: profileLastActive,
  };

  const isCurrentUser = currentUser.profile.id === result.id;
  const currentFilter = getCurrentFilter(filter);

  return (
    <div className="mx-14 mt-6">
      <ProfileHeader isCurrentUser={isCurrentUser} />

      <div className="max-w-5xl mx-auto -mt-24">
        <div className="flex gap-6">
          <div className="md:w-2/3">
            <div className="relative mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <ProfilePictureSection isCurrentUser={isCurrentUser} />
              <ProfileInfoSection
                profile={profileResult}
                isCurrentUser={isCurrentUser}
              />

              <div className="flex justify-between top-seperator mt-3 pt-3 px-8 mb-3">
                <ProfileStats
                  postsCount={result._count.posts}
                  followersCount={result._count.followers}
                  followingCount={result._count.following}
                />

                {!isCurrentUser && (
                  <div className="flex gap-4">
                    <Follow profile={profileResult} />
                    <Message />
                  </div>
                )}
              </div>
            </div>

            <Filter currentFilter={currentFilter} filters={profileFilters} />

            <Feed posts={result.posts} />
          </div>

          <aside className="md:w-1/3 space-y-6 sticky top-4 self-start">
            <Search query={query} />
            <ActivitySummary lastActive={result.lastActive} />
            <MightKnow />
          </aside>
        </div>
      </div>
    </div>
  );
}
