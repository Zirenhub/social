'use client';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import useProfile from '@/hooks/profile/useProfile';
import Avatar from '../ui/Avatar';

const ProfileHover = dynamic(() => import('./ProfileHover'));

type Props = {
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    id: string;
  };
  createdAt: string;
};

export default function PostHeader({ profile, createdAt }: Props) {
  const [hover, setHover] = useState<boolean>(false);
  const { profile: data, error, isLoading } = useProfile(profile.id, hover);
  if (error) return <div>Error: {error.message}</div>;

  const router = useRouter();

  const handleNavigateToProfile = () => {
    router.push(`/profile/${profile.id}`);
  };

  const debouncedShowHover = useDebouncedCallback(() => {
    setHover(true);
  }, 300);

  const hideHover = () => {
    debouncedShowHover.cancel();
    setHover(false);
  };

  return (
    <div className="relative mb-3 flex items-start">
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleNavigateToProfile();
        }}
        onMouseEnter={debouncedShowHover}
        onMouseLeave={hideHover}
        className="flex cursor-pointer items-center gap-3"
      >
        <Avatar profile={profile} />

        {hover && data && (
          <Suspense
            key={profile.id}
            fallback={
              <div className="absolute left-0 top-12 z-10 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                </div>
              </div>
            }
          >
            <ProfileHover profile={data} isLoading={isLoading} />
          </Suspense>
        )}

        <div className="flex flex-col hover:underline">
          <h3 className="font-semibold text-lg dark:text-white">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username} • {createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
