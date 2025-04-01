'use client';
import { PostWithCounts } from '@/types/post';
import { EllipsisVertical, Trash } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuItem } from '../ui/DropdownMenu';
import Follow from '../profile/profile-interactions/Follow';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import LoaderPlaceholder from '../ui/LoaderPlaceholder';

const DeletePostModal = dynamic(() => import('./DeletePostModal'), {
  loading: () => null,
});

type PostOptionsProps = {
  post: PostWithCounts;
};

export default function PostOptions({ post }: PostOptionsProps) {
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const session = useSession();
  if (session.status === 'loading') {
    return <LoaderPlaceholder />;
  }
  if (session.status === 'unauthenticated') {
    throw new Error('Session not found');
  }
  if (!session.data) {
    return null;
  }
  const isOwner = session.data.user.profile === post.profileId;

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
          <Follow profileId={post.profileId} asDropdownItem />
        )}
      </DropdownMenu>
    </>
  );
}
