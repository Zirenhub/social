'use client';
import {
  User2Icon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
} from 'lucide-react';
import { formatJoinedDate } from '@/helpers/formatDate';
import LoaderPlaceholder from '../ui/LoaderPlaceholder';
import { GetProfileType } from '@/types/profile';

type Props = {
  profile: GetProfileType;
  isLoading: boolean;
};

export default function ProfileHover({ profile, isLoading }: Props) {
  return (
    <div className="absolute z-10 top-15 left-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 p-4 pointer-events-none">
      {isLoading ? (
        <LoaderPlaceholder />
      ) : (
        <>
          {/* Popup Arrow */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>

          {/* Profile Content */}
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 p-1 rounded-full mr-2 border-2 border-gray-400">
              <User2Icon size={'full'} color="gray" />
            </div>
            <div>
              <h3 className="font-['bold'] text-gray-800 dark:text-gray-100">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{profile?.username}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div className="flex items-center">
              <BriefcaseIcon size={16} className="mr-2 text-gray-500" />
              <span>Software Developer</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-2 text-gray-500" />
              <span>{profile?.location || 'Kuklen'}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-2 text-gray-500" />
              <span>Joined {formatJoinedDate(profile?.createdAt)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="font-['bold'] text-gray-800 dark:text-gray-100">
                  {profile?._count.posts}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  Posts
                </span>
              </div>
              <div>
                <span className="font-['bold'] text-gray-800 dark:text-gray-100">
                  {profile?._count.followers}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  Followers
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
