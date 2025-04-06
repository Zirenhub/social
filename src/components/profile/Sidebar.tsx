'use client';
import ActivitySummary from './ActivitySummary';
import MightKnow from '../ui/MightKnow';
import { ProfileActivity } from '@/types/profile';
import Search from '../ui/search/Search';
import useSyncScroll from '@/hooks/useSyncScroll';
import { useRef } from 'react';

type Props = ProfileActivity;

export default function Sidebar({ lastActive, _count }: Props) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useSyncScroll(sidebarRef);

  return (
    <aside
      ref={sidebarRef}
      className="pb-8 sticky top-0 h-screen flex flex-col gap-6 overflow-y-auto no-scrollbar"
    >
      <Search />
      <ActivitySummary lastActive={lastActive} _count={_count} />
      <MightKnow />
    </aside>
  );
}
