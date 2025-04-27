"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import CreatePost from "@/components/ui/CreatePost";
import CreateReply from "@/components/ui/CreateReply";
import { useModal } from "@/context/ModalProvider";
import useProfile from "@/hooks/profile/useProfile";

export default function Page() {
  const [isReplyingTo, setIsReplyingTo] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (params?.slug) {
      if (params.slug[0] === "reply" && typeof params.slug[1] === "string") {
        setIsReplyingTo(params.slug[1]);
      }
    }
  }, [params]);

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
      if (!isReplyingTo) {
        openModal(<CreatePost onSuccess={closeModal} />, {
          title: "Create a post",
          profile,
          onClose: goBack,
        });
        return;
      } else {
        // maybe just do this inside comment interactions ?
        openModal(<CreateReply commentId={isReplyingTo} />, { profile, title: "Create a reply.", onClose: goBack });
      }
    }
  }, [isReplyingTo, status, session, isLoading, error, profile, openModal, closeModal, goBack]);

  return null;
}
