"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { MoveLeftIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import ActivitySummary from "@/components/profile/ActivitySummary";
import ProfileInteractions from "@/components/profile/profile-interactions/ProfileInteractions";
import { useModal } from "@/context/ModalProvider";
import getFilterUrl from "@/helpers/getFilterUrl";
import { Filters } from "@/types/constants";
import { GetProfileType, ProfileActivity } from "@/types/profile";
import LinkUI from "../../LinkUI";

type ProfileHeaderProps = { profile: GetProfileType & { isCurrentUser: boolean; activity: ProfileActivity } };

const SCROLL_THRESHOLD = 500;
const DEBOUNCE_DELAY = 10;

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const router = useRouter();
  const [showInteractions, setShowInteractions] = useState<boolean>(false);
  // prevents the callback from becoming stale or needing the state in its dependency array
  const showInteractionsRef = useRef(showInteractions);

  useEffect(() => {
    showInteractionsRef.current = showInteractions;
  }, [showInteractions]);

  const debouncedScrollHandler = useDebouncedCallback(() => {
    const currentScrollY = window.scrollY;
    const shouldBeVisible = currentScrollY > SCROLL_THRESHOLD;

    if (shouldBeVisible !== showInteractionsRef.current) {
      setShowInteractions(shouldBeVisible);
    }
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    const initialScrollY = window.scrollY;
    const initialVisibility = initialScrollY > SCROLL_THRESHOLD;
    setShowInteractions(initialVisibility);
    showInteractionsRef.current = initialVisibility;

    window.addEventListener("scroll", debouncedScrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
    };
  }, [debouncedScrollHandler]);

  const { openModal } = useModal();

  return (
    <>
      <div className="flex justify-between items-center w-full text-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <MoveLeftIcon size={18} />
          </button>
          <div className="leading-tight min-w-0">
            <p className="font-semibold truncate">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{profile._count.posts} posts</p>
          </div>
        </div>
        {showInteractions ? (
          <ProfileInteractions profile={profile} variant="header" />
        ) : (
          <button
            onClick={() => openModal(<ActivitySummary {...profile.activity} />, { profile })}
            className="text-xs text-cyan-500 bg-cyan-500/10 rounded-md px-2 py-1"
          >
            Activity
          </button>
        )}
      </div>
    </>
  );
}

export function SimpleHeader({ title, back = true }: { title: string; back?: boolean }) {
  const router = useRouter();

  return (
    <div className="flex gap-3 items-center w-full text-lg">
      {back && (
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <MoveLeftIcon size={18} />
        </button>
      )}
      <h1 className="text-gray-600 dark:text-gray-400">{title}</h1>
    </div>
  );
}

type HomeHeaderProps = {
  currentFilter: string;
  filters: Filters<string>[];
};

export function HomeHeader({ currentFilter, filters }: HomeHeaderProps) {
  const activeFilter = filters.find((f) => f.url === currentFilter)?.url;

  return (
    <>
      <div className="absolute left-2/4 top-1 -translate-x-2/4">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-500 opacity-75 blur-sm" />
          <Link
            href="/home"
            className="relative flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full text-2xl font-bold shadow-md"
          >
            <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 text-transparent bg-clip-text">
              🔥
            </span>
          </Link>
        </motion.div>
      </div>
      <div className="mt-5 flex">
        {filters.map((filter) => {
          return (
            <LinkUI
              key={filter.label}
              isActive={activeFilter === filter.url}
              href={getFilterUrl(filter.url)}
              className={clsx(
                "flex items-center justify-between font-medium",
                activeFilter === filter.url && "border-b-2 border-cyan-500"
              )}
            >
              <span className="text-center w-full">{filter.label}</span>
            </LinkUI>
          );
        })}
      </div>
    </>
  );
}
