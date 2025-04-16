import { getUser } from "@/app/api/auth/fetching";
import { getProfile, getProfileActivity } from "@/app/api/profile/fetching";
import Feed from "@/components/post/Feed";
import ProfileInteractions from "@/components/profile/profile-interactions/ProfileInteractions";
import ProfilePictureSection from "@/components/profile/ProfileAvatar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoSection from "@/components/profile/ProfileInfo";
import ProfileStats from "@/components/profile/ProfileStats";
import Sidebar from "@/components/profile/Sidebar";
import Filter from "@/components/ui/Filter";
import { ProfileHeader as MobileProfileHeader } from "@/components/ui/mobile/headers";
import { HeaderSlot } from "@/components/ui/mobile/MobileHeader";
import getSession from "@/lib/getSession";
import { PROFILE_PAGE_POSTS_FILTERS, profileFilters } from "@/types/constants";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ filter?: string }> };

export default async function Profile({ params, searchParams }: Props) {
  const { slug } = await params;
  const { filter } = await searchParams;

  const currentFilter = PROFILE_PAGE_POSTS_FILTERS.find((x) => x === filter) || "posts";
  const session = await getSession();
  const currentUser = await getUser(session.user.id);

  const [profileResult, profileActivity] = await Promise.all([
    getProfile({ profileId: slug, userProfileId: currentUser.profile.id }),
    getProfileActivity(slug),
  ]);
  const isCurrentUser = currentUser.profile.id === profileResult.id;

  return (
    <div className="sm:px-6 md:px-[2vw]">
      <HeaderSlot
        content={<MobileProfileHeader profile={{ ...profileResult, isCurrentUser, activity: profileActivity }} />}
        avatar={false}
      />
      <ProfileHeader isCurrentUser={isCurrentUser} />

      <div className="max-w-5xl mx-auto -mt-24">
        <div className="md:flex gap-3 relative">
          <div className="relative flex flex-col sm:gap-3 w-full">
            <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 sm:rounded-b-md md:rounded-lg flex w-full p-2 gap-3">
              <div className="flex flex-col w-full">
                <ProfilePictureSection profile={profileResult} />
                <div className="mt-1 text-sm sm:text-base">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] bg-clip-text text-transparent leading-none whitespace-nowrap">
                    {`${profileResult.firstName} ${profileResult.lastName}`}
                  </h1>
                  <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">@{profileResult.username}</p>
                </div>
                <p className="text-sm sm:text-base text-[var(--color-dark-500)]/30 dark:text-white/80 max-w-prose my-2 sm:my-6 ">
                  {profileResult.bio ||
                    (isCurrentUser ? "No bio yet. Click on Edit Profile to add your bio." : "This user has no bio.")}
                </p>
                <ProfileStats
                  postsCount={profileResult._count.posts}
                  followersCount={profileResult._count.followers}
                  followingCount={profileResult._count.following}
                />
              </div>
              <div className="flex flex-col text-sm whitespace-nowrap">
                <ProfileInfoSection profile={profileResult} variant="compact" />
                <ProfileInteractions profile={{ ...profileResult, isCurrentUser }} />
              </div>
            </div>

            <Filter currentFilter={currentFilter} filters={profileFilters} />
            <Feed
              filter={currentFilter}
              endpoint={`/api/profile/${profileResult.id}/posts`}
              showCreatePost={isCurrentUser && currentFilter === "posts"}
            />
          </div>
          <div className="hidden md:block w-2/4">
            <Sidebar {...profileActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
