import { motion } from "framer-motion";

import LogOut from "@/components/nav-bar/LogOut";
import ThemeSwitcher from "@/components/nav-bar/ThemeSwitcher";
import { GetProfileType } from "@/types/profile";
import Avatar from "../../Avatar";

type Props = {
  profile: GetProfileType;
};

export default function Profile({ profile }: Props) {
  const { firstName, lastName, username, _count } = profile;

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full flex flex-col justify-between z-100 p-3 bg-white dark:bg-slate-900 border- border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-xl dark:shadow-black/30"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-2">
          <Avatar profile={profile} className="h-12 w-12" />
        </div>
        <p className="text-xl font-semibold text-gray-800 dark:text-slate-100">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">@{username}</p>

        <div className="flex flex-col text-center gap-4 mt-6">
          <div className="top-seperator">
            <p className="mt-2 text-base font-medium text-gray-800 dark:text-slate-100">{_count.posts}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Posts</p>
          </div>
          <div className="top-seperator">
            <p className="mt-2 text-base font-medium text-gray-800 dark:text-slate-100">{_count.following}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Following</p>
          </div>
          <div className="top-seperator">
            <p className="mt-2 text-base font-medium text-gray-800 dark:text-slate-100">{_count.followers}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Followers</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="flex items-center justify-between w-full pt-4 top-seperator">
        <LogOut />
        <ThemeSwitcher />
      </div>
    </motion.div>
  );
}
