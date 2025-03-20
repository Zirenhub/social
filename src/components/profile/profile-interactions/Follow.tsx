'use client';
import { followProfile, unfollowProfile } from '@/app/api/profile/actions';
import { GetProfileType } from '@/types/profile';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  profile: GetProfileType;
};

export default function Follow({ profile }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(profile.followers.length > 0);
  const isFollowingMe = profile.following.length > 0;

  const handleFollowAction = async () => {
    try {
      setIsLoading(true);

      if (isFollowing) {
        await unfollowProfile(profile.id);
        toast.success('Unfollowed!');
        setIsFollowing(false);
      } else {
        await followProfile(profile.id);
        toast.success(isFollowingMe ? 'Followed back!' : 'Followed!');
        setIsFollowing(true);
      }
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
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

  return (
    <button
      className={`${isFollowing ? 'primary-button group' : 'primary-button'}`}
      disabled={isLoading}
      onClick={handleFollowAction}
    >
      {isFollowing ? (
        <>
          <span className="hidden group-hover:block">{buttonText.hover}</span>
          <span className="group-hover:hidden">{buttonText.default}</span>
        </>
      ) : (
        buttonText.default
      )}
    </button>
  );
}
