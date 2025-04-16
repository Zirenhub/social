import LastActiveUpdater from "@/components/LastActiveUpdater";
import Navigation from "@/components/nav-bar/Navigation";
import NewProfileModalTrigger from "@/components/new-profile/NewProfileTrigger";
import Responsive from "@/components/ui/Responsive";
import getSession from "@/lib/getSession";
import { getProfile, getProfileActivity } from "../api/profile/fetching";

export default async function AppLayout({ create, children }: { create: React.ReactNode; children: React.ReactNode }) {
  const session = await getSession();
  const [profile, profileActivity] = await Promise.all([
    getProfile({
      profileId: session.user.profile,
      userProfileId: session.user.profile,
    }),
    getProfileActivity(session.user.profile),
  ]);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Navigation profile={profile} />

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 overflow-auto bg-gradient-to-br from-white to-[var(--color-cyan-500)]/5 dark:from-[var(--color-dark-500)] dark:to-[var(--color-purple-500)]/10"
      >
        <Responsive profile={profile}>{children}</Responsive>
      </main>

      {/* Other UI Utilities */}
      <NewProfileModalTrigger profile={profile} />
      <LastActiveUpdater lastActive={profileActivity.lastActive} />
      {create}
    </div>
  );
}
