"use client";

import { useRouter } from "next/navigation";

import { PostWithCounts } from "@/types/post";
import PostHeader from "./PostHeader";
import PostInteractions from "./PostInteractions";
import PostOptions from "./PostOptions";

type Props = { post: PostWithCounts };

export default function PostContainer({ post }: Props) {
  const router = useRouter();

  function handleNavigatePost() {
    sessionStorage.setItem("hash", post.id);
    router.push(`/post/${post.id}`);
  }

  return (
    <div
      id={post.id}
      key={post.id}
      onClick={handleNavigatePost}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-200/10 cursor-pointer md:rounded-xl md:shadow-sm"
    >
      <div className="flex justify-between items-start px-2 pt-2 md:px-4 md:pt-4">
        <PostHeader profile={{ ...post.profile, id: post.profileId }} post={{ createdAt: post.createdAt }} />
        <PostOptions post={post} />
      </div>

      <p className="text-gray-800 dark:text-gray-200 px-2 pb-2 md:px-4 text-base md:text-lg">{post.content}</p>

      <PostInteractions post={post} />
    </div>
  );
}
