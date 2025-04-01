'use client';

import { followProfile, unfollowProfile } from '@/app/api/profile/actions';
import { useCallback, useMemo, useTransition } from 'react';
import { toast } from 'react-toastify';
import useProfile from './useProfile';

const BUTTON_STATES = {
  FOLLOWING: { default: 'Following', hover: 'Unfollow' },
  FOLLOW_BACK: { default: 'Follow back', hover: 'Follow back' },
  FOLLOW: { default: 'Follow', hover: 'Follow' },
};

export function useFollow(profileId: string) {
  const [isPending, startTransition] = useTransition();
  const { profile, isLoading, isError, mutate } = useProfile(profileId);

  const isFollowing = useMemo(
    () => profile?.followers && Boolean(profile.followers.length > 0),
    [profile?.followers]
  );

  const isFollowingMe = useMemo(
    () => profile?.following && Boolean(profile.following.length > 0),
    [profile?.following]
  );

  // Determine button text based on relationship status
  const buttonText = () => {
    if (isFollowing) return BUTTON_STATES.FOLLOWING;
    if (isFollowingMe) return BUTTON_STATES.FOLLOW_BACK;
    return BUTTON_STATES.FOLLOW;
  };

  // Handle follow/unfollow action
  const handleFollowAction = useCallback(() => {
    if (!profile) {
      toast.error('Profile data not available');
      return;
    }

    startTransition(async () => {
      try {
        let result;
        let optimisticData;

        if (isFollowing) {
          result = await unfollowProfile(profile.id);
          if (!result.success) throw new Error('Unfollow failed');
          optimisticData = { ...profile, followers: [] };
        } else {
          result = await followProfile(profile.id);
          if (!result.success || !result.data) throw new Error('Follow failed');
          optimisticData = { ...profile, followers: [result.data] };
        }
        await mutate(optimisticData, {
          optimisticData: optimisticData,
          revalidate: true,
          populateCache: true,
          rollbackOnError: true,
        });
        toast.success(
          isFollowing
            ? `Unfollowed @${profile.username}`
            : `Followed ${isFollowingMe ? 'back ' : ''}@${profile.username}`
        );
      } catch (error) {
        toast.error('Action failed. Please try again.');
      }
    });
  }, [profile, isFollowing, isFollowingMe, startTransition]);

  const isLoadingState = isPending || isLoading || !profile;

  const errorHandler = useCallback(() => {
    toast.error('Unable to load profile data');
  }, []);

  return {
    isLoading: isLoadingState,
    isFollowing,
    buttonText,
    handleFollowAction: isError ? errorHandler : handleFollowAction,
  };
}
