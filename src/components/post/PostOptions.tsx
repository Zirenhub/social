"use client";

import { EllipsisVertical, Trash } from "lucide-react";
import { useSession } from "next-auth/react";

import { useModal } from "@/context/ModalProvider";
import useDelete from "@/hooks/post/useDelete";
import { PostWithCounts } from "@/types/post";
import Follow from "../profile/profile-interactions/Follow";
import { DropdownMenu, DropdownMenuItem } from "../ui/DropdownMenu";
import LoaderPlaceholder from "../ui/LoaderPlaceholder";

type PostOptionsProps = { post: PostWithCounts };

export default function PostOptions({ post }: PostOptionsProps) {
  const session = useSession();
  const { openModal, closeModal } = useModal();
  const isOwner = (session.data?.user.profile ?? "") === post.profileId;

  const DeleteConfirmation = () => {
    const { isPending, handleDeletePost } = useDelete({ postId: post.id, onSuccess: closeModal });

    return (
      <>
        <p className="mb-6 text-[var(--color-dark-500)]/70 dark:text-white/70">
          This action cannot be undone. The post will be permanently removed from our servers.
        </p>
        {isPending ? (
          <LoaderPlaceholder className="justify-end" />
        ) : (
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={closeModal}
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
      </>
    );
  };

  const handleOpenDeleteModal = () => {
    openModal(<DeleteConfirmation />, { title: "Are you sure you want to delete this post?" });
  };

  return (
    <DropdownMenu
      trigger={
        <div className="cursor-pointer flex items-center justify-center w-8 h-8 transition-colors rounded-full text-[var(--color-dark-500)]/70 dark:text-white/70 hover:bg-[var(--color-cyan-500)]/10 hover:text-[var(--color-cyan-500)] dark:hover:text-[var(--color-cyan-500)]">
          <EllipsisVertical size={18} />
        </div>
      }
    >
      {isOwner ? (
        <DropdownMenuItem onClick={handleOpenDeleteModal}>
          <Trash size={16} className="mr-2" />
          Delete Post
        </DropdownMenuItem>
      ) : (
        <Follow profileId={post.profileId} asDropdownItem />
      )}
    </DropdownMenu>
  );
}
