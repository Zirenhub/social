import { formatJoinedDate } from '@/helpers/formatDate';
import { GetProfileType } from '@/types/profile';
import { Calendar, MapPin } from 'lucide-react';

type Props = {
  profile: GetProfileType;
  isCurrentUser: boolean;
};

export default function ProfileInfoSection({ profile, isCurrentUser }: Props) {
  return (
    <div className="pb-8 px-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] bg-clip-text text-transparent pb-1">
        {`${profile.firstName} ${profile.lastName}`}
      </h1>

      <p className="text-[var(--color-dark-500)]/60 dark:text-white/60">
        @{profile.username}
      </p>

      <p className="mt-4 text-[var(--color-dark-500)]/80 dark:text-white/80">
        {profile.bio ||
          (isCurrentUser ? (
            'No bio yet. Click on Edit Profile to add your bio.'
          ) : (
            <span className="text-[var(--color-dark-500)]/30 dark:text-white/80">
              This user has no bio.
            </span>
          ))}
      </p>

      <div className="flex flex-wrap gap-4 mt-6">
        {profile.location && (
          <div className="flex items-center gap-1 text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
            <MapPin
              size={16}
              className="text-[var(--color-cyan-500)]"
              aria-hidden="true"
            />
            {profile.location}
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-[var(--color-dark-500)]/60 dark:text-white/60">
          <Calendar
            size={16}
            className="text-[var(--color-cyan-500)]"
            aria-hidden="true"
          />
          Joined {formatJoinedDate(profile.createdAt)}
        </div>
      </div>
    </div>
  );
}
