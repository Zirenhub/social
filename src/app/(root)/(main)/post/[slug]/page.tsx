import { getPost } from '@/app/api/posts/fetching';
import { PostWithCounts } from '@/types/post';
import PostContainer from '@/components/post/PostContainer';
import { SessionProvider } from 'next-auth/react';
import getSession from '@/lib/getSession';
import CreateComment from '@/components/ui/CreateComment';
import { getProfile } from '@/app/api/profile/fetching';
import CommentFeed from '@/components/comment/CommentFeed';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const auth = await getSession();
  const post: PostWithCounts = await getPost({
    postId: slug,
    userProfileId: auth.user.profile,
  });
  const profile = await getProfile({
    profileId: auth.user.profile,
    userProfileId: auth.user.profile,
  });

  return (
    <div className="flex flex-col gap-3">
      <SessionProvider>
        <PostContainer post={post} />
      </SessionProvider>
      <CreateComment
        post={{ id: post.id, profile: { username: post.profile.username } }}
        profile={profile}
      />
      <CommentFeed postId={post.id} />
    </div>
  );
}
