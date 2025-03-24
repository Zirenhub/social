'use client';
import { followProfile, unfollowProfile } from '@/app/api/profile/actions';
import { GetProfileType } from '@/types/profile';
import { UserRoundMinusIcon, UserRoundPlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  profile: GetProfileType;
  sideEffect?: () => void;
  className?: string;
};

export default function Follow({ sideEffect, profile, className }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(profile.followers.length > 0);
  const isFollowingMe = profile.following.length > 0;

  const handleFollowAction = async () => {
    try {
      setIsLoading(true);

      if (isFollowing) {
        await unfollowProfile(profile.id);
        toast.success(`Unfollowed @${profile.username}`);
        setIsFollowing(false);
      } else {
        await followProfile(profile.id);
        toast.success(
          isFollowingMe
            ? `Followed back @${profile.username}`
            : `Followed @${profile.username}`
        );
        setIsFollowing(true);
      }
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      if (sideEffect) {
        sideEffect();
      }
      setIsLoading(false);
    }
  };

  // Determine button text based on current state
  const getButtonText = () => {
    if (isFollowing) {
      return { default: 'Following', hover: 'Unfollow' };
    } else if (isFollowingMe) {
      return { default: 'Follow back', hover: 'Follow back' };
    } else {
      return { default: 'Follow', hover: 'Follow' };
    }
  };

  const buttonText = getButtonText();

  const getClassName = () => {
    if (className) {
      return className;
    }

    return 'primary-button';
  };

  return (
    <button
      className={`${isFollowing ? `${getClassName()} group` : getClassName()}`}
      disabled={isLoading}
      onClick={handleFollowAction}
    >
      {isFollowing ? (
        <>
          <span className="hidden group-hover:flex items-center">
            <UserRoundMinusIcon size={16} className="mr-2" /> {buttonText.hover}
          </span>
          <span className="group-hover:hidden">{buttonText.default}</span>
        </>
      ) : (
        <div className="flex items-center">
          <UserRoundPlusIcon size={16} className="mr-2" /> {buttonText.default}
        </div>
      )}
    </button>
  );
}
