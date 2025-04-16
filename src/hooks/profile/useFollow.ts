"use client";

import { useCallback, useMemo } from "react";
import type { Follow } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { followProfile, unfollowProfile } from "@/app/api/profile/actions";
import type { ApiResponse } from "@/types/api";
import { CACHE_TAGS, HOME_PAGE_POSTS_FILTERS } from "@/types/constants";
import useProfile from "./useProfile";

const BUTTON_STATES = {
  FOLLOWING: { default: "Following", hover: "Unfollow" },
  FOLLOW_BACK: { default: "Follow back", hover: "Follow back" },
  FOLLOW: { default: "Follow", hover: "Follow" },
};

export function useFollow(profileId: string) {
  const queryClient = useQueryClient();
  const { profile, isLoading, error, refetch } = useProfile(profileId);

  const isFollowing = useMemo(() => profile?.followers && Boolean(profile.followers.length > 0), [profile?.followers]);

  const isFollowingMe = useMemo(
    () => profile?.following && Boolean(profile.following.length > 0),
    [profile?.following]
  );

  const buttonText = () => {
    if (isFollowing) return BUTTON_STATES.FOLLOWING;
    if (isFollowingMe) return BUTTON_STATES.FOLLOW_BACK;
    return BUTTON_STATES.FOLLOW;
  };

  const { mutate: toggleFollow, isPending } = useMutation<ApiResponse<Follow | null>>({
    mutationFn: () => (isFollowing ? unfollowProfile(profileId) : followProfile(profileId)),
    onSettled: async (data) => {
      if (!data || !data.success) {
        toast.error(data?.error.message || "Operation failed");
        return;
      }
      await refetch();
      queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.POSTS, HOME_PAGE_POSTS_FILTERS[1]],
      });
      toast.success(isFollowing ? `Unfollowed @${profile?.username}` : `Followed @${profile?.username}`);
    },
  });

  const isLoadingState = isPending || isLoading || !profile;

  const errorHandler = useCallback(() => {
    toast.error("Unable to load profile data");
  }, []);

  return {
    isLoading: isLoadingState,
    isFollowing,
    buttonText,
    handleFollowAction: error ? errorHandler : toggleFollow,
  };
}
