type Props = { postsCount: number; followersCount: number; followingCount: number };

export default function ProfileStats({ postsCount, followersCount, followingCount }: Props) {
  const counts = [
    { count: postsCount, label: "Posts" },
    { count: followersCount, label: "Followers" },
    { count: followingCount, label: "Following" },
  ];

  return (
    <div className="flex gap-8">
      {counts.map(({ count, label }) => (
        <div key={label} className="text-center flex flex-col items-center text-xs sm:text-base">
          <div className="font-semibold text-[var(--color-dark-500)] dark:text-white">{count}</div>
          <div className="text-[var(--color-dark-500)]/60 dark:text-white/60">{label}</div>
        </div>
      ))}
    </div>
  );
}
