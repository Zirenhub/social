'use client';
import { UserRoundMinusIcon, UserRoundPlusIcon } from 'lucide-react';
import { useFollow } from '@/hooks/profile/useFollow';
import { DropdownMenuItem } from '@/components/ui/DropdownMenu';
import LoaderPlaceholder from '@/components/ui/LoaderPlaceholder';

type Props = {
  profileId: string;
  sideEffect?: () => void;
  asDropdownItem?: boolean;
};

export default function Follow({
  sideEffect,
  profileId,
  asDropdownItem,
}: Props) {
  const { isLoading, isFollowing, buttonText, handleFollowAction } =
    useFollow(profileId);

  if (isLoading) {
    return (
      <LoaderPlaceholder className="flex items-center justify-center w-full" />
    );
  }

  const { default: buttonTextDefault, hover } = buttonText();

  const onFollowAction = () => {
    handleFollowAction();
    if (sideEffect) {
      sideEffect();
    }
  };
  // fix, could be better
  if (asDropdownItem) {
    return (
      <DropdownMenuItem
        className={`${isFollowing ? 'group' : ''}`}
        disabled={isLoading}
        onClick={onFollowAction}
      >
        {isFollowing ? (
          <>
            <span className="hidden group-hover:flex items-center">
              <UserRoundMinusIcon size={16} className="mr-2" /> {hover}
            </span>
            <span className="group-hover:hidden">{buttonTextDefault}</span>
          </>
        ) : (
          <div className="flex items-center">
            <UserRoundPlusIcon size={16} className="mr-2" /> {buttonTextDefault}
          </div>
        )}
      </DropdownMenuItem>
    );
  }

  return (
    <button
      className={`primary-button ${isFollowing ? 'group' : ''}`}
      disabled={isLoading}
      onClick={onFollowAction}
    >
      {isFollowing ? (
        <>
          <span className="hidden group-hover:flex items-center">
            <UserRoundMinusIcon size={16} className="mr-2" /> {hover}
          </span>
          <span className="group-hover:hidden">{buttonTextDefault}</span>
        </>
      ) : (
        <div className="flex items-center">
          <UserRoundPlusIcon size={16} className="mr-2" /> {buttonTextDefault}
        </div>
      )}
    </button>
  );
}
