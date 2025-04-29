import type React from "react";

import Notifications from "@/components/home/Notifications";
import ProfileCard from "@/components/home/ProfileCard";
import Sidebar from "@/components/home/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  /* md:pr-[72px]  on main div */
  return (
    <div className="md:flex md:items-start md:text-lg md:justify-between md:mx-14">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col gap-4 h-[calc(100vh-2rem)] top-4 sticky flex-shrink-0 justify-center">
        <ProfileCard />
        <Notifications />
      </aside>

      {/* Main Content */}
      <main className="md:mt-4 md:flex-1 md:mx-8 md:flex md:justify-center">
        <div className="md:w-[600px]">{children}</div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden 2xl:flex sticky top-4 h-[calc(100vh-2rem)] w-80 flex-shrink-0">
        <Sidebar />
      </aside>
    </div>
  );
}
