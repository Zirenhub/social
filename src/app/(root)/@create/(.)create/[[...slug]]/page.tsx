"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import CreatePost from "@/components/ui/CreatePost";
import { useModal } from "@/context/ModalProvider";
import useProfile from "@/hooks/profile/useProfile";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openModal, closeModal } = useModal();

  const profileId = session?.user.profile ?? "";
  const shouldFetchProfile = status === "authenticated" && !!profileId;
  const { isLoading, error, profile } = useProfile(profileId, shouldFetchProfile);

  const goBack = useCallback(() => router.back(), [router]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      openModal(<p>Please sign in to create a post.</p>, { onClose: goBack });
      return;
    }

    if (isLoading) {
      openModal(<p>Loading profile...</p>, { onClose: goBack });
      return;
    }

    if (error) {
      openModal(<p>Error: {error.message}</p>, { onClose: goBack });
      return;
    }

    if (profile) {
      openModal(<CreatePost onSuccess={closeModal} />, {
        title: "Create a post",
        profile,
        onClose: goBack,
      });
    }
  }, [status, session, isLoading, error, profile, openModal, closeModal, goBack]);

  return null;
}
