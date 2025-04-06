import Navigation from '@/components/nav-bar/Navigation';
import React from 'react';
import LastActiveUpdater from '@/components/LastActiveUpdater';
import { differenceInMinutes } from 'date-fns';
import NewProfileModal from '@/components/NewProfileModal';
import { getUser } from '../api/auth/fetching';
import getSession from '@/lib/getSession';

export default async function AppLayout({
  create,
  children,
}: {
  create: React.ReactNode;
  children: React.ReactNode;
}) {
  const session = await getSession();

  const user = await getUser(session.user.id);
  const isUserNew =
    differenceInMinutes(new Date(), new Date(user.profile.createdAt)) <= 5;

  return (
    <div className="flex w-full h-screen">
      {isUserNew && <NewProfileModal user={user} />}
      <LastActiveUpdater lastActive={user.profile.lastActive} />
      <Navigation user={user} />
      <main
        id="main-content"
        className="flex-1 min-h-screen bg-gradient-to-br from-white to-[var(--color-cyan-500)]/5 dark:from-[var(--color-dark-500)] dark:to-[var(--color-purple-500)]/10 overflow-auto"
      >
        {children}
      </main>
      {create}
    </div>
  );
}
