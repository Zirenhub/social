import { useEffect } from "react";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";

import PostHeader from "@/components/post/PostHeader";
import { useModal } from "@/context/ModalProvider";
import getReplyTarget from "@/helpers/getReplyTarget";
import { useCreateComment } from "@/hooks/comment/useCreateComment";
import useProfile from "@/hooks/profile/useProfile";
import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";
import Avatar from "../Avatar";
import LoaderPlaceholder from "../LoaderPlaceholder";
import Textarea from "../Textarea";

type Props = {
  content: CommentWithCounts | PostWithCounts;
};

export default function CreateReply({ content }: Props) {
  const { closeModal } = useModal();
  const { postId, parentId } = getReplyTarget(content);
  const { submit, formErrors, register, isSubmitting, charProps, isSuccess } = useCreateComment({
    postId,
    parentId,
  });
  const { data: session, status } = useSession();

  const profileId = session?.user.profile ?? "";
  const shouldFetchProfile = status === "authenticated" && !!profileId;
  const { isLoading, error, profile } = useProfile(profileId, shouldFetchProfile);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!profile) {
    return <p>Something went wrong getting profile.</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col">
      <div className="bg-gray-200/20 dark:bg-gray-800/70 rounded-md px-2 pt-2 shadow-sm">
        <div className="flex justify-between items-start">
          <PostHeader profile={{ ...content.profile, id: content.profileId }} post={{ createdAt: content.createdAt }} />
        </div>

        <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg pb-3">{content.content}</p>
      </div>

      <p className="leading-none text-gray-400 text-sm mt-6 mb-2">
        Replying to <span className="text-[var(--color-cyan-500)]">@{content.profile.username}</span>
      </p>
      <div className="flex gap-3">
        <Avatar profile={profile} />
        <Textarea
          register={register}
          name={"content"}
          charProps={charProps}
          placeholder="What do you have to say about this?"
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        {formErrors?.content && <p className="text-[var(--color-magenta-500)] text-sm">{formErrors.content.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting || charProps.charCount > charProps.maxChars || charProps.charCount <= 0}
          className="primary-button py-2 px-2 ml-auto"
        >
          {isSubmitting ? (
            <LoaderPlaceholder text="Commenting..." />
          ) : (
            <div className="flex items-center gap-2 disabled:bg-gray-300">
              <Send size={18} />
              <span>Reply</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
