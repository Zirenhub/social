'use client';
import { deletePost } from '@/app/api/post/actions';
import { PostWithCounts } from '@/types/post';
import { EllipsisVertical, Trash } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import Follow from '../profile/profile-interactions/Follow';

type Props = {
  post: PostWithCounts;
  isOwner: boolean;
};

export default function PostOptions({ post, isOwner }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showDeletePostModal, setShowDeletePostModal] =
    useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  async function handleDeletePost(e: React.MouseEvent) {
    e.stopPropagation();

    const result = await deletePost({ postId: post.id });

    if (!result.success) {
      toast.error(result.error.message);
      return;
    }

    toast.success('Post successfully deleted');

    setShowDeletePostModal(false);
    setIsOpen(false);
  }

  return (
    <>
      <Modal
        title="Are you sure you want to delete this post?"
        isOpen={showDeletePostModal}
        close={() => setShowDeletePostModal(false)}
      >
        <p className="mb-6 text-[var(--color-dark-500)]/70 dark:text-white/70">
          This action cannot be undone. The post will be permanently removed
          from our servers.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowDeletePostModal(false)}
            className="cursor-pointer px-4 py-2 text-sm font-medium transition-colors rounded-lg text-[var(--color-dark-500)]/80 dark:text-white/80 hover:bg-[var(--color-dark-500)]/5 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletePost}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-[var(--color-magenta-500)] hover:bg-[var(--color-magenta-500)]/90"
          >
            Delete
          </button>
        </div>
      </Modal>

      <div ref={menuRef} className="relative ml-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer flex items-center justify-center w-8 h-8 transition-colors rounded-full text-[var(--color-dark-500)]/70 dark:text-white/70 hover:bg-[var(--color-cyan-500)]/10 hover:text-[var(--color-cyan-500)] dark:hover:text-[var(--color-cyan-500)]"
          aria-label="Post options"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <EllipsisVertical size={18} />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-1 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-[var(--color-dark-500)] border border-[var(--color-dark-500)]/10 dark:border-white/10 min-w-40">
            {isOwner ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeletePostModal(true);
                }}
                className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-left transition-colors text-[var(--color-dark-500)]/80 dark:text-white/80 hover:bg-[var(--color-magenta-500)]/10 hover:text-[var(--color-magenta-500)]"
              >
                <Trash size={16} className="mr-2" />
                Delete Post
              </button>
            ) : null
            // <Follow
            //   sideEffect={() => {
            //     setIsOpen(false);
            //   }}
            //   profile={profile}
            //   className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-left transition-colors text-[var(--color-dark-500)]/80 dark:text-white/80 hover:bg-[var(--color-magenta-500)]/10 hover:text-[var(--color-magenta-500)]"
            // />
            }
          </div>
        )}
      </div>
    </>
  );
}
