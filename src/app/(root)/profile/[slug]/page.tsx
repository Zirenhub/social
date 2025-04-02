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
import getSession from '@/lib/getSession';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfilePictureSection from '@/components/profile/ProfileAvatar';
import ProfileInfoSection from '@/components/profile/ProfileInfo';
import { getUser } from '@/app/api/auth/fetching';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string; query?: string }>;
};

export default async function Profile({ params, searchParams }: Props) {
  const { slug } = await params;
  const { filter, query } = await searchParams;

  const currentFilter =
    PROFILE_PAGE_POSTS_FILTERS.find((x) => x === filter) || 'posts';
  const session = await getSession();
  const currentUser = await getUser(session.user.id);

  const [profileResult, profilePosts, profileActivity] = await Promise.all([
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
    activity: profileActivity,
  };

  const isCurrentUser = currentUser.profile.id === result.id;

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
                    <Follow profileId={result.id} />
                    <Message />
                  </div>
                )}
              </div>
            </div>

            <Filter currentFilter={currentFilter} filters={profileFilters} />

            <Feed
              posts={result.posts}
              showCreatePost={isCurrentUser && currentFilter === 'posts'}
            />
          </div>

          <aside className="md:w-1/3 space-y-6 sticky top-4 self-start">
            <Search query={query} />
            <ActivitySummary activity={result.activity} />
            <MightKnow />
          </aside>
        </div>
      </div>
    </div>
  );
}
