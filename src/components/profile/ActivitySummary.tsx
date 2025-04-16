import { differenceInMinutes } from "date-fns";

import { formatCreatedAtDate } from "@/helpers/formatDate";
import { ACTIVITY_THRESHOLDS } from "@/types/constants";
import { ProfileActivity } from "@/types/profile";

type Props = ProfileActivity;

export default function ActivitySummary({ _count, lastActive }: Props) {
  function getLastActiveStatus(): string {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const minutesDifference = differenceInMinutes(now, lastActiveDate);
    // Show "Now" if within threshold
    if (minutesDifference <= ACTIVITY_THRESHOLDS.UPDATE_LAST_ACTIVE_MINUTES) {
      return "Now";
    } else {
      return formatCreatedAtDate(lastActiveDate, { hour: false });
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="mb-4 container-title">Activity Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last active</span>
          <span className="text-sm font-medium">{getLastActiveStatus()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Posts this month</span>
          <span className="text-sm font-medium">{_count.posts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Followers this month</span>
          <span className="text-sm font-medium">{_count.followers}</span>
        </div>
      </div>
      <div className="mt-6 pt-4 top-seperator">
        <button className="cursor-pointer w-full py-2 text-sm font-medium text-[var(--color-cyan-500)] hover:text-[var(--color-blue-500)] transition-colors">
          View detailed stats
        </button>
      </div>
    </div>
  );
}
