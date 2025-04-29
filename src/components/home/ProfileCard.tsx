import { getProfile } from "@/app/api/profile/fetching";
import getSession from "@/lib/getSession";
import ProfileStats from "../profile/ProfileStats";
import Avatar from "../ui/Avatar";
import OnlineIndicator from "../ui/OnlineIndicator";

export default async function ProfileCard() {
  const session = await getSession();
  const profileResult = await getProfile({
    profileId: session.user.profile,
    userProfileId: session.user.profile,
  });
  const { firstName, lastName, username, bio, coverImageUrl, _count } = profileResult;

  return (
    <div className="w-fit rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 shadow-xl backdrop-blur-md transition flex flex-col">
      {/* Cover Section */}
      <div className="h-14 relative">
        {coverImageUrl ? (
          <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-t-2xl bg-gradient-to-r from-[var(--color-cyan-500)]/50 via-[var(--color-blue-500)]/50 to-[var(--color-purple-500)]/50" />
        )}
        <div className="absolute -bottom-8 left-2/4 -translate-x-2/4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
            <Avatar
              profile={profileResult}
              className="relative h-20 w-20 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-lg"
            />
            <OnlineIndicator className="h-5 w-5 absolute bottom-0 right-0 shadow-md border-2 border-white dark:border-gray-900" />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-lg font-medium text-center">{`${firstName} ${lastName}`}</h2>
        <p className="text-sm text-gray-600 dark:text-white/60">@{username}</p>
        <p className="mt-2 text-gray-700 dark:text-white/80 text-center">{bio}</p>
      </div>

      {/* Stats Section */}
      <div className="mx-2 mb-2 p-2 rounded-xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white/70 to-gray-50 dark:from-gray-800/40 dark:to-gray-900/30 inset-shadow-sm">
        <ProfileStats postsCount={_count.posts} followersCount={_count.followers} followingCount={_count.following} />
      </div>
    </div>
  );
}
