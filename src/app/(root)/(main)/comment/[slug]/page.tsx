import { getComment } from "@/app/api/comments/fetching";
import { getProfile } from "@/app/api/profile/fetching";
import CommentContainer from "@/components/comment/CommentContainer";
import CommentFeed from "@/components/comment/CommentFeed";
import PostContainer from "@/components/post/PostContainer";
import CreateComment from "@/components/ui/CreateComment";
import { SimpleHeader } from "@/components/ui/mobile/headers";
import { HeaderSlot } from "@/components/ui/mobile/MobileHeader";
import getSession from "@/lib/getSession";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Comment({ params }: Props) {
  const { slug } = await params;
  const auth = await getSession();
  const { comment, parents, post } = await getComment({
    commentId: slug,
  });
  const profile = await getProfile({
    profileId: auth.user.profile,
    userProfileId: auth.user.profile,
  });

  return (
    <div className="flex flex-col md:gap-3">
      <HeaderSlot content={<SimpleHeader title="Comment" />} avatar={false} />
      <PostContainer post={post} isRooted />
      {parents.length > 0 && (
        <div>
          {parents.map((parent) => {
            return (
              <div key={parent.id} className="mt-4">
                <CommentContainer post={post} comment={parent} isRooted />
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-4 mb-2">
        <CommentContainer post={post} comment={comment} isRooted isFocused />
      </div>
      <CreateComment post={post} comment={comment} profile={profile} parents={parents} />
      <CommentFeed post={post} comment={comment} />
    </div>
  );
}
