import { useCallback } from "react";
import { useSession } from "next-auth/react";

import CommentContainer from "@/components/comment/CommentContainer";
import PostContainer from "@/components/post/PostContainer";
import { useModal } from "@/context/ModalProvider";
import { useCreatePost } from "@/hooks/post/useCreatePost";
import useProfile from "@/hooks/profile/useProfile";
import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";
import Avatar from "../Avatar";
import Textarea from "../Textarea";

type Props = {
  post: PostWithCounts;
  comment?: CommentWithCounts;
  parents?: CommentWithCounts[];
};

export default function CreateRepost({ post, comment, parents }: Props) {
  const { closeModal } = useModal();
  const { data: session, status } = useSession();

  const profileId = session?.user.profile ?? "";
  const shouldFetchProfile = status === "authenticated" && !!profileId;
  const { isLoading, error, profile } = useProfile(profileId, shouldFetchProfile);

  const onSuccess = useCallback(() => {
    closeModal();
  }, [closeModal]);

  // fix reposting on comments, currently only on posts works!
  const { submit, formErrors, register, isSubmitting, charProps } = useCreatePost({ repostOfId: post.id, onSuccess });

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
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Avatar profile={profile} />
        <div className="flex flex-col flex-1 gap-3">
          <div className="flex-1">
            <Textarea
              register={register}
              name="content"
              charProps={charProps}
              placeholder="Add a comment! (You dont have to)"
            />
          </div>
          <div>
            {comment ? (
              <CommentContainer post={post} comment={comment} parents={parents} />
            ) : (
              <PostContainer post={post} />
            )}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => e.stopPropagation()}
        type="submit"
        disabled={isSubmitting}
        className="primary-button h-10 font-bold rounded-full"
      >
        {isSubmitting ? "Submitting..." : "Post"}
      </button>
      {formErrors?.content && <p className="text-[var(--color-magenta-500)] text-sm">{formErrors.content.message}</p>}
    </form>
  );
}
