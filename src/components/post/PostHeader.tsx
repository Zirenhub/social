'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User2Icon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  profile: {
    firstName: string;
    lastName: string;
    id: string;
  };
  createdAt: string;
};

export default function PostHeader({ profile, createdAt }: Props) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigateToProfile = () => {
    router.push(`/profile/${profile.id}`);
  };

  const handleMouseEnter = useDebouncedCallback(() => {
    setIsHovered(true);
  }, 300);

  const handleMouseLeave = useDebouncedCallback(() => {
    setIsHovered(false);
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

        {/* {isHovered && (
          <Suspense
            fallback={
              <div className="absolute left-0 top-12 z-10 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                </div>
              </div>
            }
          >
            <ProfileHoverCard profile={hoverProfile} />
          </Suspense>
        )} */}

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
