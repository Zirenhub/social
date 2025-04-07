'use client';
import { PostWithCounts } from '@/types/post';
import PostHeader from './PostHeader';
import { formatCreatedAtDate } from '@/helpers/formatDate';
import PostInteractions from './PostInteractions';
import PostOptions from './PostOptions';
import { useRouter } from 'next/navigation';

type Props = {
  post: PostWithCounts;
};

export default function PostContainer({ post }: Props) {
  const router = useRouter();

  function handleNavigatePost() {
    router.push(`/post/${post.id}`);
  }

  return (
    <div
      key={post.id}
      onClick={handleNavigatePost}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-200/10 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <PostHeader
          profile={{ ...post.profile, id: post.profileId }}
          createdAt={formatCreatedAtDate(post.createdAt)}
        />
        <PostOptions post={post} />
      </div>
      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
      <PostInteractions post={post} />
    </div>
  );
}
