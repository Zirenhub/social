'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import type { PaginatedPosts } from '@/types/post';
import { fetcher } from '@/lib/fetcher';
import { CACHE_TAGS } from '@/types/constants';

type UseInfiniteScrollOptions = {
  endpoint: string;
  filter: string;
  nextCursor: string | null;
};

export default function useInfiniteScroll({
  endpoint,
  filter,
  nextCursor,
}: UseInfiniteScrollOptions) {
  const queryKey = [CACHE_TAGS.POSTS, filter];
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isError,
  } = useInfiniteQuery<
    PaginatedPosts,
    Error,
    { pages: PaginatedPosts[] },
    string[],
    string | null
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('filter', filter);
      if (pageParam) params.append('cursor', pageParam);

      return await fetcher(`${endpoint}?${params.toString()}`);
    },
    enabled: nextCursor ? true : false,
    initialPageParam: nextCursor,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    retry: false,
    gcTime: 0, // maybe fix in the future
  });
  // Extract posts from all pages
  const posts = data?.pages?.flatMap((page) => page.posts) || [];

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px',
    triggerOnce: false,
  });

  const [debouncedInView] = useDebounce(inView, 200);

  const shouldLoadMore = useRef(false);

  const loadMore = useCallback(() => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) {
      shouldLoadMore.current = true;
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  useEffect(() => {
    if (debouncedInView && !shouldLoadMore.current) {
      loadMore();
    }

    if (!debouncedInView) {
      shouldLoadMore.current = false;
    }
  }, [debouncedInView, loadMore]);

  return {
    posts,
    error,
    isLoading: isFetching && !isFetchingNextPage && posts.length === 0,
    isFetchingNextPage,
    isEmpty: posts.length === 0 && !isFetching,
    isReachingEnd: !hasNextPage,
    isError,
    sentinelRef: ref,
    fetchNextPage: loadMore,
    refetch,
  };
}
