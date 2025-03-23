'use client';
import { useRouter } from 'next/navigation';
import { User2Icon } from 'lucide-react';
import ProfileHover from '../profile/ProfileHover';
import { GetProfileType } from '@/types/profile';

type Props = {
  profile: GetProfileType;
  createdAt: string;
};

export default function PostHeader({ profile, createdAt }: Props) {
  const router = useRouter();

  function handleNavigateToProfile() {
    router.push(`/profile/${profile.id}`);
  }

  return (
    <div
      onClick={handleNavigateToProfile}
      className="flex relative group cursor-pointer hover:underline"
    >
      <div className="w-12 h-12 p-1 rounded-full mr-3 border-2 border-gray-400 cursor-pointer">
        <User2Icon size={'full'} color="gray" />
      </div>

      {/* Profile Popup */}
      <ProfileHover profile={profile} />

      <div>
        <h3 className="font-['bold'] text-gray-800 dark:text-gray-100">
          {profile.firstName} {profile.lastName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{createdAt}</p>
      </div>
    </div>
  );
}
