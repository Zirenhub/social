import Link from "next/link";
import clsx from "clsx";
import { Edit } from "lucide-react";

import Follow from "./Follow";
import Message from "./Message";

type Props = { profile: { isCurrentUser: boolean; id: string }; variant?: "header" | "default" };

export default function ProfileInteractions({ profile, variant = "default" }: Props) {
  if (profile.isCurrentUser) {
    return (
      <Link
        href="/profile/edit"
        className={clsx(
          "flex whitespace-nowrap px-3 py-2 items-center gap-2 font-medium transition-all duration-200 rounded-lg bg-[var(--color-cyan-500)]/10 text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)] hover:text-white",
          variant === "header" && "text-xs"
        )}
      >
        <Edit size={16} aria-hidden="true" />
        Edit Profile
      </Link>
    );
  }

  const containerClasses = clsx({
    "flex flex-wrap gap-3 sm:flex-nowrap sm:flex-row sm:items-center": variant === "default",
    "flex items-center gap-2 text-xs": variant === "header",
  });

  return (
    <div className={containerClasses}>
      <Follow profileId={profile.id} />
      <Message />
    </div>
  );
}
