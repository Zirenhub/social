import Navigation from '@/components/nav-bar/Navigation';
import React from 'react';
import { getUser } from '@/lib/session';
import LastActiveUpdater from '@/components/LastActiveUpdater';
import { differenceInMinutes } from 'date-fns';
import NewProfileModal from '@/components/NewProfileModal';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const isUserNew =
    differenceInMinutes(new Date(), new Date(user.profile.createdAt)) <= 5;

  return (
    <div className="flex w-full h-screen">
      {isUserNew && <NewProfileModal user={user} />}
      <LastActiveUpdater lastActive={user.profile.lastActive} />
      <Navigation user={user} />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-white to-[var(--color-cyan-500)]/5 dark:from-[var(--color-dark-500)] dark:to-[var(--color-purple-500)]/10 pb-12 overflow-auto">
        {children}
      </main>
    </div>
  );
}
