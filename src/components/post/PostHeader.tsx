'use client';
import { useRouter } from 'next/navigation';
import { User2Icon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { GetProfileType } from '@/types/profile';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

const ProfileHover = dynamic(() => import('./ProfileHover'));

type Props = {
  profile: GetProfileType;
  createdAt: string;
};

export default function PostHeader({ profile, createdAt }: Props) {
  const [hover, setHover] = useState<boolean>(false);

  const router = useRouter();

  const handleNavigateToProfile = () => {
    router.push(`/profile/${profile.id}`);
  };

  const handleMouseEnter = useDebouncedCallback(() => {
    setHover(true);
  }, 300);

  const handleMouseLeave = useDebouncedCallback(() => {
    setHover(false);
  }, 300);

  return (
    <div className="relative mb-3 flex items-start">
      <div
        onClick={handleNavigateToProfile}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex cursor-pointer items-center hover:underline"
      >
        <div className="w-12 h-12 p-1 rounded-full mr-3 border-2 border-gray-400 cursor-pointer">
          <User2Icon size={'full'} color="gray" />
        </div>

        {hover && (
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
            <ProfileHover profile={profile} />
          </Suspense>
        )}

        <div>
          <h3 className="font-['bold'] text-gray-800 dark:text-gray-100">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
