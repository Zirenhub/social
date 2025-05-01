"use client";

import { useSession } from "next-auth/react";

import { useModal } from "@/context/ModalProvider";
import useDelete from "@/hooks/comment/useDelete";
import { CommentWithCounts } from "@/types/comment";
import BaseOptionsDropdown from "../ui/BaseOptionsDropdown";
import DeleteConfirmation from "../ui/modal/DeleteConfirmation";

type CommentsOptionsProps = { comment: CommentWithCounts; postId: string };

export default function CommentOptions({ comment, postId }: CommentsOptionsProps) {
  const session = useSession();
  const { openModal, closeModal } = useModal();
  const isOwner = (session.data?.user.profile ?? "") === comment.profileId;

  const { isPending, handleDeletePost } = useDelete({
    commentId: comment.id,
    postId,
    onSuccess: closeModal,
  });

  const handleOpenDeleteModal = () => {
    openModal(
      <DeleteConfirmation
        contentType="comment"
        isPending={isPending}
        onCancel={closeModal}
        onDelete={handleDeletePost}
      />,
      { title: "Are you sure you want to delete this comment?" }
    );
  };

  return (
    <BaseOptionsDropdown
      isOwner={isOwner}
      profileId={comment.profileId}
      contentLabel="Commment"
      onDelete={handleOpenDeleteModal}
    />
  );
}
