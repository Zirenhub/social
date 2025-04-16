import { SimpleProfile } from "@/types/post";

type Props = { profile: SimpleProfile; createdAt?: string };

export default function ProfileMeta({ profile, createdAt }: Props) {
  const { firstName, lastName, username } = profile;

  return (
    <div className="flex flex-col space-y-0">
      <h3 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">
        {firstName} {lastName}
      </h3>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-none">
        @{username}
        {createdAt && <span className="mx-1">•</span>}
        {createdAt && <span>{createdAt}</span>}
      </p>
    </div>
  );
}
