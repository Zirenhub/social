'use client';
import { PostWithCounts } from '@/types/post';
import Modal from '../ui/Modal';
import useDelete from '@/hooks/post/useDelete';
import LoaderPlaceholder from '../ui/LoaderPlaceholder';

type DeletePostModalProps = {
  post: PostWithCounts;
  onClose: () => void;
};

export default function DeletePostModal({
  post,
  onClose,
}: DeletePostModalProps) {
  const { isPending, handleDeletePost } = useDelete({
    postId: post.id,
    onSuccess: onClose,
  });

  return (
    <Modal
      title="Are you sure you want to delete this post?"
      isOpen={true}
      close={onClose}
    >
      <p className="mb-6 text-[var(--color-dark-500)]/70 dark:text-white/70">
        This action cannot be undone. The post will be permanently removed from
        our servers.
      </p>
      {isPending ? (
        <LoaderPlaceholder className="justify-end" />
      ) : (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
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
      )}
    </Modal>
  );
}
