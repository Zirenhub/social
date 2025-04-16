import Image from "next/image";

import { BasicProfile } from "@/types/profile";

type Props = {
  profile: BasicProfile;
  className?: string;
};

export default function Avatar({ profile, className }: Props) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div
      className={`@container shrink-0 relative h-10 w-10 rounded-full overflow-hidden bg-[var(--color-cyan-500)] flex items-center justify-center text-white font-medium no-underline cursor-pointer select-none ${className ? className : ""}`}
    >
      {profile.avatarUrl ? (
        <Image src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} fill className="object-cover" />
      ) : (
        <span style={{ fontSize: "clamp(0.75rem, 50cqw, 3.5rem)" }}>{initials}</span>
      )}
    </div>
  );
}
