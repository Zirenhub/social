import Notifications from '@/components/home/Notifications';
import ProfileCard from '@/components/home/ProfileCard';
import Sidebar from '@/components/home/Sidebar';

type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  return (
    <div className="flex items-start text-lg justify-between mx-14 pr-[72px]">
      {/* Left Sidebar */}
      <aside className="hidden xl:flex flex-col gap-3 sticky mt-4 top-4 h-[calc(100vh-2rem)] flex-shrink 2xl:flex-1 items-start">
        <ProfileCard />
        <Notifications />
      </aside>

      <main className="mt-4 flex flex-col not-2xl:w-[90%] not-2xl:ml-18 2xl:min-w-1/3 2xl:w-[600px] justify-center">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden 2xl:flex justify-end sticky top-0 flex-1">
        <div className="w-76">
          <Sidebar />
        </div>
      </aside>
    </div>
  );
}
