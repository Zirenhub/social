import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Edit,
  Settings,
  Grid,
  BookmarkIcon,
  Heart,
  Share2,
  User2Icon,
} from 'lucide-react';
import MightKnow from '@/components/sidebar/MightKnow';
import ActivitySummary from '@/components/profile/ActivitySummary';
import Feed from '@/components/home/Feed';
import {
  getProfileBasic,
  getProfileLastActive,
} from '@/app/api/profile/fetching';
import { formatJoinedDate } from '@/helpers/formatDate';

type Props = { params: Promise<{ slug: string }> };

export default async function Profile({ params }: Props) {
  const { slug } = await params;
  const profileResult = await getProfileBasic(slug);

  if (!profileResult.success || !profileResult.data) {
    return (
      <p className="text-center h-full text-lg text-red-400">
        {profileResult.error?.message}
      </p>
    );
  }

  const lastActiveResult = await getProfileLastActive(slug);

  const result = { ...profileResult.data, lastActive: lastActiveResult };

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
          <Link
            href="/settings"
            className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-105"
          >
            <Settings size={18} className="text-white" />
          </Link>
        </div>
      </div>

      {/* Profile container */}
      <div className="max-w-5xl mx-auto -mt-24">
        <div className="flex gap-6">
          {/* Left side - Profile info */}
          <div className="md:w-2/3">
            <div className="relative mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ">
              {/* Profile picture */}
              <div className="absolute left-8 -top-6 ring-white dark:ring-[var(--color-dark-500)] rounded-full shadow-xl bg-white p-4">
                <User2Icon size={120} className="object-cover" color="gray" />
              </div>

              {/* Edit profile button */}
              <div className="flex justify-end p-4">
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg bg-[var(--color-cyan-500)]/10 text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)] hover:text-white"
                >
                  <Edit size={16} />
                  Edit Profile
                </Link>
              </div>

              {/* Profile content */}
              <div className="pt-16 pb-8 px-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] bg-clip-text text-transparent pb-1">
                  {`${result.firstName} ${result.lastName}`}
                </h1>

                <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">
                  @{result.username}
                </p>

                <p className="mt-4 text-[var(--color-dark-500)]/80 dark:text-white/80">
                  {result.bio ||
                    'No bio yet. Click on Edit Profile to add your bio.'}
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

                <div className="flex flex-wrap gap-8 pt-6 mt-8 border-t border-[var(--color-dark-500)]/10 dark:border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[var(--color-dark-500)] dark:text-white">
                      {0}
                    </div>
                    <div className="text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
                      Posts
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[var(--color-dark-500)] dark:text-white">
                      {0}
                    </div>
                    <div className="text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
                      Followers
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[var(--color-dark-500)] dark:text-white">
                      {0}
                    </div>
                    <div className="text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
                      Following
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs navigation - styled similar to home page filters */}
            <div className="flex mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-0 z-20">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-[var(--color-cyan-500)] border-b-2 border-[var(--color-cyan-500)] font-medium">
                <Grid size={18} />
                <span>Posts</span>
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors">
                <BookmarkIcon size={18} />
                <span>Saved</span>
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors">
                <Heart size={18} />
                <span>Liked</span>
              </button>
            </div>

            {/* Posts */}
            <Feed filter="forYou" />
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
