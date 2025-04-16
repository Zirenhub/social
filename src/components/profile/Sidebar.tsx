"use client";

import { useRef } from "react";

import useSyncScroll from "@/hooks/useSyncScroll";
import { ProfileActivity } from "@/types/profile";
import MightKnow from "../ui/MightKnow";
import Search from "../ui/search/Search";
import ActivitySummary from "./ActivitySummary";

type Props = ProfileActivity;

export default function Sidebar({ lastActive, _count }: Props) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useSyncScroll(sidebarRef);

  return (
    <aside ref={sidebarRef} className="pb-8 sticky top-0 h-screen flex flex-col gap-6 overflow-y-auto no-scrollbar">
      <Search />
      <ActivitySummary lastActive={lastActive} _count={_count} />
      <MightKnow />
    </aside>
  );
}
