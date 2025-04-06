import { Edit } from 'lucide-react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import { GetProfileType } from '@/types/profile';

type Props = {
  profile: GetProfileType;
  isCurrentUser: boolean;
};

export default function ProfilePictureSection({
  profile,
  isCurrentUser,
}: Props) {
  return (
    <div className="h-4 mb-28 flex items-start w-full">
      <div className="absolute left-8 -top-6 ring-white dark:ring-[var(--color-dark-500)] rounded-full shadow-xl bg-white p-1">
        <Avatar profile={profile} className="w-34 h-34" />
      </div>
      {isCurrentUser && (
        <div className="ml-auto">
          <Link
            href="/profile/edit"
            className="flex px-3 py-2 m-3 items-center gap-2 text-sm font-medium transition-all duration-200 rounded-lg bg-[var(--color-cyan-500)]/10 text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)] hover:text-white"
          >
            <Edit size={16} aria-hidden="true" />
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
}
