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
    <div className="flex mt-3 pt-3 gap-8 border-t border-[var(--color-dark-500)]/10 dark:border-white/10">
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
