import clsx from "clsx";
import { Calendar } from "lucide-react";

import { formatJoinedDate } from "@/helpers/formatDate";
import { GetProfileType } from "@/types/profile";

type ProfileInfoSectionProps = { profile: GetProfileType; variant?: "full" | "compact" };

export default function ProfileInfoSection({ profile, variant = "full" }: ProfileInfoSectionProps) {
  const isFull = variant === "full";
  const iconSize = isFull ? 16 : 14;

  const metaItemClasses = clsx(
    "flex items-center gap-1",
    isFull ? "text-sm" : "text-xs",
    "text-[var(--color-dark-500)]/60 dark:text-white/60"
  );

  const metaContainerClasses = clsx("flex flex-col inline-flex flex-wrap gap-3 items-end h-full md:gap-4");

  const infoItems = [{ icon: Calendar, label: `Joined ${formatJoinedDate(profile.createdAt)}` }];

  return (
    <div className={metaContainerClasses}>
      {infoItems.map(({ icon: Icon, label }, i) => (
        <div key={i} className={metaItemClasses}>
          {label}
          <Icon size={iconSize} className="text-[var(--color-cyan-500)]" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
