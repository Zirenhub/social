'use client';

import { useEffect } from 'react';
import { updateLastActive } from '@/app/api/auth/actions';

export default function LastActiveUpdater({
  shouldUpdate,
}: {
  shouldUpdate: boolean;
}) {
  useEffect(() => {
    if (shouldUpdate) {
      updateLastActive();
    }
  }, [shouldUpdate]);

  return null;
}
