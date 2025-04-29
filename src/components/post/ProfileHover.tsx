"use client";

import { BriefcaseIcon, CalendarIcon, MapPinIcon } from "lucide-react";

import { formatJoinedDate } from "@/helpers/formatDate";
import { GetProfileType } from "@/types/profile";
import Avatar from "../ui/Avatar";
import LoaderPlaceholder from "../ui/LoaderPlaceholder";

type Props = { profile: GetProfileType; isLoading: boolean };

export default function ProfileHover({ profile, isLoading }: Props) {
  return (
    <div className="absolute z-10 top-14 left-0 min-w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 p-4 pointer-events-none">
      {isLoading ? (
        <LoaderPlaceholder />
      ) : (
        <>
          {/* Popup Arrow */}
          <div className="absolute -top-2 left-3 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>

          {/* Profile Content */}
          <div className="flex items-center mb-3 gap-3">
            <Avatar profile={profile} />
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{profile?.username}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div className="flex items-center">
              <BriefcaseIcon size={16} className="mr-2 text-gray-500 shrink-0" />
              <span>Software Developer</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-2 text-gray-500 shrink-0" />
              <span>{profile?.location || "Kuklen"}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-2 text-gray-500 shrink-0" />
              <span>Joined {formatJoinedDate(profile?.createdAt)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-100">{profile?._count.posts}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-100">{profile?._count.followers}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
