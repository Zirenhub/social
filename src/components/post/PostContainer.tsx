import { PostWithCounts } from '@/types/post';
import PostHeader from './PostHeader';
import { formatCreatedAtDate } from '@/helpers/formatDate';
import PostInteractions from './PostInteractions';
import { getProfile } from '@/app/api/profile/fetching';
import PostOptions from './PostOptions';
import getSession from '@/lib/getSession';

type Props = {
  post: PostWithCounts;
};

export default async function PostContainer({ post }: Props) {
  const session = await getSession();
  const profile = await getProfile({
    profileId: post.profileId,
    userProfileId: session.user.profile,
  });

  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <PostHeader
          profile={profile}
          createdAt={formatCreatedAtDate(post.createdAt)}
        />
        <PostOptions
          post={post}
          profile={profile}
          isOwner={post.profileId === session.user.profile}
        />
      </div>
      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
      <PostInteractions post={post} />
    </div>
  );
}
