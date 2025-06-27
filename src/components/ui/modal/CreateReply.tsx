import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";

import PostHeader from "@/components/post/PostHeader";
import { useModal } from "@/context/ModalProvider";
import { useCreateComment } from "@/hooks/comment/useCreateComment";
import useProfile from "@/hooks/profile/useProfile";
import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";
import Avatar from "../Avatar";
import LoaderPlaceholder from "../LoaderPlaceholder";
import Textarea from "../Textarea";

type Props = {
  post: PostWithCounts;
  comment?: CommentWithCounts;
  parents?: CommentWithCounts[];
};

export default function CreateReply({ post, comment, parents }: Props) {
  const [replyingTo, setReplyingTo] = useState<Set<string>>(new Set());

  const { closeModal } = useModal();
  const { submit, formErrors, register, isSubmitting, charProps, isSuccess } = useCreateComment({
    postId: post.id,
    comment,
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

  useEffect(() => {
    const combinedUsernames: string[] = [post.profile.username];
    if (comment) {
      combinedUsernames.push(comment.profile.username);
    }
    if (parents) {
      const parentUsernames = parents.map((parent) => parent.profile.username);
      combinedUsernames.push(...parentUsernames);
    }

    setReplyingTo(new Set(combinedUsernames));
  }, [post, comment, parents]);

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
          {comment ? (
            <PostHeader
              profile={{ ...comment.profile, id: comment.profileId }}
              post={{ createdAt: comment.createdAt }}
            />
          ) : (
            <PostHeader profile={{ ...post.profile, id: post.profileId }} post={{ createdAt: post.createdAt }} />
          )}
        </div>

        <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg pb-3">
          {comment ? comment.content : post.content}
        </p>
      </div>

      <div className="flex leading-none text-gray-400 text-sm mt-6 mb-2">
        Replying to{" "}
        <div className="flex gap-1 ml-1">
          {Array.from(replyingTo).map((replying) => {
            return (
              <span key={replying} className="text-[var(--color-cyan-500)]">
                @{replying}
              </span>
            );
          })}
        </div>
      </div>
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
