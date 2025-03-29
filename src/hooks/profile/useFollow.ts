'use client';
import { followProfile, unfollowProfile } from '@/app/api/profile/actions';
import { GetProfileType } from '@/types/profile';
import { useCallback, useTransition } from 'react';
import { toast } from 'react-toastify';

export function useFollow(initialProfile: GetProfileType) {
  const [isPending, startTransition] = useTransition();

  const isFollowing = initialProfile.followers.length > 0;
  const isFollowingMe = initialProfile.following.length > 0;

  const getButtonText = useCallback(() => {
    if (isFollowing) return { default: 'Following', hover: 'Unfollow' };
    if (isFollowingMe) return { default: 'Follow back', hover: 'Follow back' };
    return { default: 'Follow', hover: 'Follow' };
  }, [isFollowing, isFollowingMe]);

  const handleFollowAction = () => {
    startTransition(async () => {
      try {
        if (isFollowing) {
          await unfollowProfile(initialProfile.id);
          toast.success(`Unfollowed @${initialProfile.username}`);
        } else {
          const result = await followProfile(initialProfile.id);
          if (!result.success || !result.data) {
            throw new Error();
          }
          toast.success(
            isFollowingMe
              ? `Followed back @${initialProfile.username}`
              : `Followed @${initialProfile.username}`
          );
        }
      } catch {
        toast.error('Action failed. Please try again.');
      }
    });
  };

  return {
    isLoading: isPending,
    isFollowing,
    buttonText: getButtonText(),
    handleFollowAction,
  };
}
