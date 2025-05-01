import { CommentWithCounts } from "@/types/comment";
import { PostWithCounts } from "@/types/post";

type Content = PostWithCounts | CommentWithCounts;

function isComment(content: Content): content is CommentWithCounts {
  return "postId" in content && "parentId" in content;
}

export default function getReplyTarget(content: Content) {
  if (isComment(content)) {
    return {
      postId: content.postId,
      parentId: content.id,
    };
  }

  return {
    postId: content.id,
    parentId: undefined,
  };
}
