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
  const { default: buttonTextDefault, hover } = buttonText();

  const onFollowAction = () => {
    handleFollowAction();
    sideEffect?.();
  };

  const FollowContent = () => (
    <>
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
    </>
  );

  if (asDropdownItem) {
    return (
      <DropdownMenuItem
        className={isFollowing ? 'group' : ''}
        disabled={isLoading}
        onClick={onFollowAction}
      >
        {isLoading ? <LoaderPlaceholder /> : <FollowContent />}
      </DropdownMenuItem>
    );
  }

  return (
    <button
      className={`primary-button ${isFollowing ? 'group' : ''}`}
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        onFollowAction;
      }}
    >
      {isLoading ? <LoaderPlaceholder color="white" /> : <FollowContent />}
    </button>
  );
}
