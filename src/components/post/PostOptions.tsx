"use client";

import { useSession } from "next-auth/react";

import { useModal } from "@/context/ModalProvider";
import useDelete from "@/hooks/post/useDelete";
import { PostWithCounts } from "@/types/post";
import BaseOptionsDropdown from "../ui/BaseOptionsDropdown";
import DeleteConfirmation from "../ui/modal/DeleteConfirmation";

type PostOptionsProps = { post: PostWithCounts };

export default function PostOptions({ post }: PostOptionsProps) {
  const session = useSession();

  const { openModal, closeModal } = useModal();

  const isOwner = (session.data?.user.profile ?? "") === post.profileId;

  const { isPending, handleDeletePost } = useDelete({
    postId: post.id,
    onSuccess: closeModal,
  });

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  const handleOpenDeleteModal = () => {
    openModal(
      <DeleteConfirmation contentType="post" isPending={isPending} onCancel={closeModal} onDelete={handleDeletePost} />,
      { title: "Are you sure you want to delete this post?" }
    );
  };

  return (
    <BaseOptionsDropdown
      isOwner={isOwner}
      profileId={post.profileId}
      contentLabel="Post"
      onDelete={handleOpenDeleteModal}
    />
  );
}
