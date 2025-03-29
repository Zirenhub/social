'use client';
import { PostWithCounts } from '@/types/post';
import { EllipsisVertical, Trash } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuItem } from '../ui/DropdownMenu';
import Follow from '../profile/profile-interactions/Follow';
import { GetProfileType } from '@/types/profile';
import dynamic from 'next/dynamic';

const DeletePostModal = dynamic(() => import('./DeletePostModal'), {
  loading: () => null,
});

type PostOptionsProps = {
  post: PostWithCounts;
  profile: GetProfileType;
  isOwner: boolean;
};

export default function PostOptions({
  post,
  profile,
  isOwner,
}: PostOptionsProps) {
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  return (
    <>
      {showDeletePostModal && (
        <DeletePostModal
          post={post}
          onClose={() => setShowDeletePostModal(false)}
        />
      )}
      <DropdownMenu
        trigger={
          <div className="cursor-pointer flex items-center justify-center w-8 h-8 transition-colors rounded-full text-[var(--color-dark-500)]/70 dark:text-white/70 hover:bg-[var(--color-cyan-500)]/10 hover:text-[var(--color-cyan-500)] dark:hover:text-[var(--color-cyan-500)]">
            <EllipsisVertical size={18} />
          </div>
        }
      >
        {isOwner ? (
          <DropdownMenuItem onClick={() => setShowDeletePostModal(true)}>
            <Trash size={16} className="mr-2" />
            Delete Post
          </DropdownMenuItem>
        ) : (
          <Follow profile={profile} asDropdownItem />
        )}
      </DropdownMenu>
    </>
  );
}
