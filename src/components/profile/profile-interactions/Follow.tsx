'use client';
import { UserRoundMinusIcon, UserRoundPlusIcon } from 'lucide-react';
import { useFollow } from '@/hooks/profile/useFollow';
import { GetProfileType } from '@/types/profile';
import { DropdownMenuItem } from '@/components/ui/DropdownMenu';

type Props = {
  profile: GetProfileType;
  sideEffect?: () => void;
  asDropdownItem?: boolean;
};

export default function Follow({ sideEffect, profile, asDropdownItem }: Props) {
  const { isLoading, isFollowing, buttonText, handleFollowAction } =
    useFollow(profile);

  const { default: buttonTextDefault, hover } = buttonText;

  const onFollowAction = () => {
    handleFollowAction();
    if (sideEffect) {
      sideEffect();
    }
  };

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
