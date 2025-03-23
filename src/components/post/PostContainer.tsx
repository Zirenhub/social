import { PostWithCounts } from '@/types/post';
import PostOptions from './PostOptions';
import PostInteractions from './PostInteractions';
import { getUser } from '@/lib/session';
import PostHeader from './PostHeader';
import { formatCreatedAtDate } from '@/helpers/formatDate';
import { getProfile } from '@/app/api/profile/fetching';

type Props = {
  post: PostWithCounts;
};

export default async function PostContainer({ post }: Props) {
  const user = await getUser();
  const profileResult = await getProfile(post.profile.id);

  if (!profileResult.success || !profileResult.data) {
    return <p>{profileResult.error?.message}</p>;
  }

  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex items-start mb-3">
        <PostHeader
          profile={profileResult.data}
          createdAt={formatCreatedAtDate(post.createdAt)}
        />
        <PostOptions
          post={post}
          isOwner={profileResult.data.id === user.profile.id}
        />
      </div>
      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
      <PostInteractions post={post} />
    </div>
  );
}
