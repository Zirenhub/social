"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { formatCreatedAtDate } from "@/helpers/formatDate";
import useHover from "@/hooks/generic/useHover";
import useProfile from "@/hooks/profile/useProfile";
import { SimpleProfile } from "@/types/post";
import Avatar from "../ui/Avatar";
import ProfileMeta from "../ui/ProfileMeta";

const ProfileHover = dynamic(() => import("./ProfileHover"));

type Props = { profile: SimpleProfile & { id: string }; post: { createdAt: Date } };

export default function PostHeader({ profile, post }: Props) {
  const router = useRouter();
  const { hover, showHover, hideHover } = useHover();
  const { profile: data, error, isLoading } = useProfile(profile.id, hover);

  const handleNavigateToProfile = () => {
    router.push(`/profile/${profile.id}`);
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="relative mb-3 flex">
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleNavigateToProfile();
        }}
        onMouseEnter={showHover}
        onMouseLeave={hideHover}
        className="flex cursor-pointer gap-2 items-start"
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

        <div>
          <ProfileMeta profile={profile} createdAt={formatCreatedAtDate(post.createdAt)} />
        </div>
      </div>
    </div>
  );
}
