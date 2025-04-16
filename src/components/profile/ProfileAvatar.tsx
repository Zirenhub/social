import { GetProfileType } from "@/types/profile";
import Avatar from "../ui/Avatar";

type Props = {
  profile: GetProfileType;
};

export default function ProfilePictureSection({ profile }: Props) {
  return (
    <div className="relative h-11 md:h-13 w-full">
      <div className="absolute left-0 -top-12 md:-top-18 ring-white dark:ring-[var(--color-dark-500)] rounded-full shadow-xl bg-white p-1">
        <Avatar profile={profile} className="w-21 h-21 md:h-28 md:w-28" />
      </div>
    </div>
  );
}
