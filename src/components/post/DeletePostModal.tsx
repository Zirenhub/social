'use client';
import { deletePost } from '@/app/api/post/actions';
import { PostWithCounts } from '@/types/post';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';

type DeletePostModalProps = {
  post: PostWithCounts;
  onClose: () => void;
};

export default function DeletePostModal({
  post,
  onClose,
}: DeletePostModalProps) {
  async function handleDeletePost() {
    const result = await deletePost({ postId: post.id });

    if (!result.success) {
      toast.error(result.error.message);
      return;
    }

    toast.success('Post successfully deleted');
    onClose();
  }

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
    </Modal>
  );
}
