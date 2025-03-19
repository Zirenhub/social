type Props = {
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

export default function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
}: Props) {
  return (
    <div className="flex gap-8">
      <div className="text-center">
        <div className="text-2xl font-semibold text-[var(--color-dark-500)] dark:text-white">
          {postsCount}
        </div>
        <div className="text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
          Posts
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-semibold text-[var(--color-dark-500)] dark:text-white">
          {followersCount}
        </div>
        <div className="text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
          Followers
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-semibold text-[var(--color-dark-500)] dark:text-white">
          {followingCount}
        </div>
        <div className="text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
          Following
        </div>
      </div>
    </div>
  );
}
