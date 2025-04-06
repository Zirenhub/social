import Image from 'next/image';

type Props = {
  profile: { firstName: string; lastName: string };
  avatarUrl?: string | null;
  className?: string;
};

export default function Avatar({ profile, avatarUrl, className }: Props) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div
      className={`@container relative h-10 w-10 rounded-full overflow-hidden bg-[var(--color-cyan-500)] flex items-center justify-center text-white font-medium no-underline cursor-pointer select-none ${className ? className : ''}`}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`${profile.firstName} ${profile.lastName}`}
          fill
          className="object-cover"
        />
      ) : (
        <span style={{ fontSize: 'clamp(0.75rem, 50cqw, 3.5rem)' }}>
          {initials}
        </span>
      )}
    </div>
  );
}
