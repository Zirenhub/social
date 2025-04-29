import clsx from "clsx";

import { SimpleProfile } from "@/types/post";

type Props = { profile: SimpleProfile; createdAt?: string; type?: "comment" };

export default function ProfileMeta({ profile, createdAt, type }: Props) {
  const { firstName, lastName, username } = profile;

  return (
    <div className="flex flex-col space-y-0">
      <h3
        className={clsx(
          "font-medium text-gray-800 dark:text-gray-100 leading-tight",
          type === "comment" ? "text-base md:text-md" : "text-sm md:text-lg"
        )}
      >
        {firstName} {lastName}
      </h3>
      <p
        className={clsx(
          "text-gray-600 dark:text-gray-300 leading-none",
          type === "comment" ? "text-xs" : "text-xs md:text-sm"
        )}
      >
        @{username}
        {createdAt && <span className="mx-1">•</span>}
        {createdAt && <span>{createdAt}</span>}
      </p>
    </div>
  );
}
