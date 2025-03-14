import { LAST_ACTIVE_THRESHOLD_S } from '@/types/constants';
import Profile from '@/types/profile';
import {
  differenceInMinutes,
  formatDistance,
  secondsToMinutes,
} from 'date-fns';

type Props = {
  profile: Profile;
};

export default function ActivitySummary({ profile }: Props) {
  const date = new Date();
  const minutesDifference = differenceInMinutes(
    new Date(profile.lastActive),
    date
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="mb-4 container-title">Activity Summary</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last active
          </span>
          <span className="text-sm font-medium">
            {Math.abs(minutesDifference) <
            secondsToMinutes(LAST_ACTIVE_THRESHOLD_S)
              ? 'Now'
              : formatDistance(profile.lastActive, new Date(), {
                  addSuffix: true,
                  includeSeconds: true,
                })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Posts this month
          </span>
          <span className="text-sm font-medium">0</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            New followers
          </span>
          <span className="text-sm font-medium">0</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button className="cursor-pointer w-full py-2 text-sm font-medium text-[var(--color-cyan-500)] hover:text-[var(--color-blue-500)] transition-colors">
          View detailed stats
        </button>
      </div>
    </div>
  );
}
