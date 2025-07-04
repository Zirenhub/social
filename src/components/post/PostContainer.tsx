"use client";

import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { PostWithCounts } from "@/types/post";
import PostHeader from "./PostHeader";
import PostInteractions from "./PostInteractions";
import PostOptions from "./PostOptions";
import RepostCard from "./RepostCard";

type Props = { post: PostWithCounts; isRooted?: boolean };

function PostContainer({ post, isRooted }: Props) {
  const router = useRouter();

  function handleNavigatePost(e: React.MouseEvent<HTMLDivElement>, repost?: boolean) {
    e.stopPropagation();
    sessionStorage.setItem("hash", post.id);
    router.push(`/post/${repost && post.repostOf ? post.repostOf.id : post.id}`);
  }

  return (
    <div
      id={post.id}
      onClick={handleNavigatePost}
      className={clsx(
        "dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-50 cursor-pointer md:rounded-xl md:shadow-sm",
        isRooted ? "bg-slate-50 md:bg-white" : "bg-white"
      )}
    >
      <div className="flex justify-between items-start px-2 pt-2 md:px-4 md:pt-4">
        <PostHeader profile={{ ...post.profile, id: post.profileId }} post={{ createdAt: post.createdAt }} />
        <PostOptions post={post} />
      </div>

      <p className="text-gray-800 dark:text-gray-200 px-2 pb-2 md:px-4 text-base md:text-lg">{post.content}</p>

      {post.repostOf && <RepostCard repost={post.repostOf} onClick={handleNavigatePost} />}

      <PostInteractions post={post} />
    </div>
  );
}

export default React.memo(PostContainer);
