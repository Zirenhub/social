import { getPost } from '@/app/api/posts/fetching';
import { PostWithCounts } from '@/types/post';
import Image from 'next/image';
import { MessageCircle, Heart, Share2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import PostContainer from '@/components/post/PostContainer';
import { SessionProvider } from 'next-auth/react';
import getSession from '@/lib/getSession';

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

  return (
    // like is stale since this is server pull and use like is invalidating only client cache
    <SessionProvider>
      <PostContainer post={post} />
    </SessionProvider>
  );
}
