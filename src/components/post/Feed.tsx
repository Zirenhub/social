"use client";

import { useEffect } from "react";
import Link from "next/link";

import useInfiniteScroll from "@/hooks/post/useInfiniteScroll";
import { CACHE_TAGS } from "@/types/constants";
import { PostWithCounts } from "@/types/post";
import ContainerPlaceholder from "../ui/ContainerPlaceholder";
import LoaderPlaceholder from "../ui/LoaderPlaceholder";
import PostContainer from "./PostContainer";

type FeedProps = { showCreatePost?: boolean; filter: string; endpoint: string };

export default function Feed({ showCreatePost = true, filter, endpoint }: FeedProps) {
  const queryKey = [CACHE_TAGS.POSTS, filter];

  const { result, error, isEmpty, isFetchingNextPage, isReachingEnd, sentinelRef, isLoading } =
    useInfiniteScroll<PostWithCounts>({ endpoint, filter, queryKey });

  useEffect(() => {
    const hash = sessionStorage.getItem("hash");
    if (hash) {
      const postElement = document.getElementById(hash);
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      sessionStorage.removeItem("hash");
    }
  }, []);

  if (error) {
    console.error("Feed error:", error);
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-red-500">Error loading posts. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <ContainerPlaceholder key={i} />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-[var(--color-dark-500)]/60 dark:text-white/60 text-lg">So empty here...</p>
        {showCreatePost && (
          <Link className="primary-button mx-auto mt-4 text-sm py-2 px-3" href="/create">
            Create a post
          </Link>
        )}
      </div>
    );
  }

  if (result.length <= 0) {
    return null;
  }

  return (
    <main className="md:space-y-6">
      {result.map((post) => (
        <PostContainer key={post.id} post={post} />
      ))}

      {/* Sentinel element for infinite loading */}
      <div ref={sentinelRef} className="flex justify-center py-4 my-2" data-testid="sentinel-element">
        {isFetchingNextPage ? (
          <LoaderPlaceholder size={24} text="Loading more posts..." />
        ) : (
          isReachingEnd && <p className="text-gray-500 dark:text-gray-400 text-sm">You've reached the end</p>
        )}
      </div>
    </main>
  );
}
