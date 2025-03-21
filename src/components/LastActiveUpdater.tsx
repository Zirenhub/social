'use client';

import { useEffect } from 'react';
import { updateLastActive } from '@/app/api/auth/actions';
import { ACTIVITY_THRESHOLDS } from '@/types/constants';
import { differenceInMinutes, minutesToMilliseconds } from 'date-fns';

type Props = {
  lastActive: Date;
};

export default function LastActiveUpdater({ lastActive }: Props) {
  useEffect(() => {
    const lastActiveDate = new Date(lastActive);
    const minutesDifference = differenceInMinutes(new Date(), lastActiveDate);
    if (minutesDifference >= ACTIVITY_THRESHOLDS.UPDATE_LAST_ACTIVE_MINUTES) {
      updateLastActive();
    }
  }, [lastActive]);

  useEffect(() => {
    // Set up interval for regular updates
    const interval = setInterval(() => {
      updateLastActive();
    }, minutesToMilliseconds(ACTIVITY_THRESHOLDS.UPDATE_LAST_ACTIVE_MINUTES));

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return null;
}
