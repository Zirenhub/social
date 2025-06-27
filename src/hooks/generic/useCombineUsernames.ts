import { useEffect, useState } from "react";

import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";

type Props = {
  post: PostWithCounts;
  comment?: CommentWithCounts;
  parents?: CommentWithCounts[];
};

export default function useCombineUsernames({ post, comment, parents }: Props) {
  const [replyingTo, setReplyingTo] = useState<Set<string>>(new Set());

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

  return { replyingTo: Array.from(replyingTo) };
}
