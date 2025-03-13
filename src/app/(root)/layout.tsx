import Navigation from '@/components/nav-bar/Navigation';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen">
      <Navigation />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pr-[72px] overflow-auto">
        {children}
      </main>
    </div>
  );
}
