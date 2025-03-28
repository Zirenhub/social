'use client';
import { PostWithCounts } from '@/types/post';
import PostHeader from './PostHeader';
import { formatCreatedAtDate } from '@/helpers/formatDate';
import PostInteractions from './PostInteractions';
import { useState } from 'react';
import { GetProfileType } from '@/types/profile';

type Props = {
  post: PostWithCounts;
};

export default function PostContainer({ post }: Props) {
  const [postProfile, setPostProfile] = useState<GetProfileType | null>(null);

  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
    >
      <PostHeader
        profile={{
          firstName: post.profile.firstName,
          lastName: post.profile.lastName,
          id: post.profile.id,
        }}
        createdAt={formatCreatedAtDate(post.createdAt)}
      />
      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
      <PostInteractions post={post} />
    </div>
  );
}
