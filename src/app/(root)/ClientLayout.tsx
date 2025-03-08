'use client';
import Navigation from '@/components/nav-bar/Navigation';
import { UserContext } from '@/context/UserContext';
import { SessionUser } from '@/types/api';
import React from 'react';

export default function ClientLayout({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </UserContext.Provider>
  );
}
