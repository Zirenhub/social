import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Edit,
  Settings,
  Share2,
  User2Icon,
} from 'lucide-react';
import MightKnow from '@/components/sidebar/MightKnow';
import ActivitySummary from '@/components/profile/ActivitySummary';
import Feed from '@/components/home/Feed';
import {
  getProfile,
  getProfileLastActive,
  getProfilePosts,
} from '@/app/api/profile/fetching';
import { formatJoinedDate } from '@/helpers/formatDate';
import { getUser } from '@/lib/session';
import ErrorParagraph from '@/components/error/ErrorParagraph';
import ProfileStats from '@/components/profile/ProfileStats';
import Follow from '@/components/profile/profile-interactions/Follow';
import Message from '@/components/profile/profile-interactions/Message';
import Filter from '@/components/filter/Filter';
import { profileFilters } from '@/types/constants';

type Props = { params: Promise<{ slug: string }> };

export default async function Profile({ params }: Props) {
  const { slug } = await params;
  const profileResult = await getProfile(slug);

  if (!profileResult.success || !profileResult.data) {
    return <ErrorParagraph message={profileResult.error?.message} />;
  }

  const profilePosts = await getProfilePosts(slug);
  // maybe check if lastActive threshold has passed, if yes, fetch and if not, use the cached value
  const profileLastActive = await getProfileLastActive(slug);

  const result = {
    ...profileResult.data,
    posts: profilePosts.data,
    lastActive: profileLastActive,
  };

  const currentUser = await getUser();
  const isCurrentUser = currentUser.profile.id === result.id;
  const { _count } = profileResult.data;

  return (
    <div className="mx-14 mt-6">
      {/* Header with improved cover photo */}
      <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue-500)] via-[var(--color-purple-500)] to-[var(--color-cyan-500)]" />

        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Settings and share buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-3">
          <Link
            href="/profile/share"
            className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-105"
          >
            <Share2 size={18} className="text-white" />
          </Link>
          {isCurrentUser && (
            <Link
              href="/settings"
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-105"
            >
              <Settings size={18} className="text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Profile container */}
      <div className="max-w-5xl mx-auto -mt-24">
        <div className="flex gap-6">
          {/* Left side - Profile info */}
          <div className="md:w-2/3">
            <div className="relative mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              {/* Profile picture */}
              <div className="h-4 mb-28 flex items-start w-full">
                <div className="absolute left-8 -top-6 ring-white dark:ring-[var(--color-dark-500)] rounded-full shadow-xl bg-white p-4">
                  <User2Icon size={120} className="object-cover" color="gray" />
                </div>
                {/* Edit profile button */}
                {isCurrentUser && (
                  <div className="ml-auto">
                    <Link
                      href="/profile/edit"
                      className="flex px-3 py-2 m-3 items-center gap-2 text-sm font-medium transition-all duration-200 rounded-lg bg-[var(--color-cyan-500)]/10 text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)] hover:text-white"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile content */}
              <div className="pb-8 px-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] bg-clip-text text-transparent pb-1">
                  {`${result.firstName} ${result.lastName}`}
                </h1>

                <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">
                  @{result.username}
                </p>

                <p className="mt-4 text-[var(--color-dark-500)]/80 dark:text-white/80">
                  {result.bio ||
                    (isCurrentUser ? (
                      'No bio yet. Click on Edit Profile to add your bio.'
                    ) : (
                      <span className="text-[var(--color-dark-500)]/30 dark:text-white/80">
                        This user has no bio.
                      </span>
                    ))}
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  {result.location && (
                    <div className="flex items-center gap-1 text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
                      <MapPin
                        size={16}
                        className="text-[var(--color-cyan-500)]"
                      />
                      {result.location}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
                    <Calendar
                      size={16}
                      className="text-[var(--color-cyan-500)]"
                    />
                    Joined {formatJoinedDate(result.createdAt)}
                  </div>
                </div>

                <div className="flex justify-between top-seperator mt-3 pt-3">
                  <ProfileStats
                    postsCount={_count.posts}
                    followersCount={_count.followers}
                    followingCount={_count.following}
                  />

                  <div className="flex gap-4">
                    {/* <!-- Follow Button --> */}
                    <Follow />
                    {/* <!-- Message Button --> */}
                    <Message />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Filters */}
            <Filter currentFilter="posts" filters={profileFilters} />

            {/* Posts */}
            {result.posts === null ? (
              <ErrorParagraph message={profilePosts.error?.message} />
            ) : (
              <Feed posts={result.posts} />
            )}
          </div>

          {/* Right side - Additional info */}
          <aside className="md:w-1/3 space-y-6 sticky top-4 self-start">
            {/* Activity summary */}
            <ActivitySummary lastActive={result.lastActive} />
            {/* Suggested connections */}
            <MightKnow />
          </aside>
        </div>
      </div>
    </div>
  );
}
