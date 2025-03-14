'use client';

import { useEffect } from 'react';
import { updateLastActive } from '@/app/api/auth/actions';

export default function LastActiveUpdater() {
  useEffect(() => {
    console.log('Updating last active,');
    async function handleUpdateLastActive() {
      await updateLastActive();
    }
    handleUpdateLastActive();
  }, []);

  return null;
}
