import { getPost } from "@/app/api/posts/fetching";
import { getProfile } from "@/app/api/profile/fetching";
import CommentFeed from "@/components/comment/CommentFeed";
import PostContainer from "@/components/post/PostContainer";
import CreateComment from "@/components/ui/CreateComment";
import { SimpleHeader } from "@/components/ui/mobile/headers";
import { HeaderSlot } from "@/components/ui/mobile/MobileHeader";
import getSession from "@/lib/getSession";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const auth = await getSession();
  const post = await getPost({
    postId: slug,
    userProfileId: auth.user.profile,
  });
  const profile = await getProfile({
    profileId: auth.user.profile,
    userProfileId: auth.user.profile,
  });

  return (
    <div className="flex flex-col md:gap-3">
      <HeaderSlot content={<SimpleHeader title="Post" />} avatar={false} />
      <PostContainer post={post} />
      <CreateComment post={post} profile={profile} />
      <CommentFeed post={post} />
    </div>
  );
}
