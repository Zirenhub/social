import { EllipsisVertical, Trash } from "lucide-react";

import Follow from "../profile/profile-interactions/Follow";
import { DropdownMenu, DropdownMenuItem } from "../ui/DropdownMenu";

type BaseOptionsDropdownProps = {
  isOwner: boolean;
  profileId: string;
  contentLabel: string;
  onDelete: () => void;
};

export default function BaseOptionsDropdown({ isOwner, profileId, contentLabel, onDelete }: BaseOptionsDropdownProps) {
  return (
    <DropdownMenu
      trigger={
        <div className="cursor-pointer flex items-center justify-center w-8 h-8 transition-colors rounded-full text-[var(--color-dark-500)]/70 dark:text-white/70 hover:bg-[var(--color-cyan-500)]/10 hover:text-[var(--color-cyan-500)] dark:hover:text-[var(--color-cyan-500)]">
          <EllipsisVertical size={18} />
        </div>
      }
    >
      {isOwner ? (
        <DropdownMenuItem onClick={onDelete}>
          <Trash size={16} className="mr-2" />
          Delete {contentLabel}
        </DropdownMenuItem>
      ) : (
        <Follow profileId={profileId} asDropdownItem />
      )}
    </DropdownMenu>
  );
}
