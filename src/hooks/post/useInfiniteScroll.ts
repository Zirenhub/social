'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import type { PaginatedPosts } from '@/types/post';
import { fetcher } from '@/lib/fetcher';
import { CACHE_TAGS } from '@/types/constants';

type UseInfinitePostsOptions = {
  initialData?: PaginatedPosts;
  endpoint: string;
  filter: string;
  enabled?: boolean;
};

export default function useInfinitePosts({
  initialData,
  endpoint,
  filter,
  enabled = true,
}: UseInfinitePostsOptions) {
  // Create a stable query key
  const queryKey = [CACHE_TAGS.POSTS, filter];

  // Track if we should load more to prevent duplicate requests
  const shouldLoadMore = useRef(false);

  // Use React Query infinite query with improved configuration
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isError,
  } = useInfiniteQuery<PaginatedPosts>({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('filter', filter);
      params.append('page', String(pageParam));

      return await fetcher(`${endpoint}?${params.toString()}`);
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Flatten all pages into posts with memoization
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  // Set up intersection observer with better configuration
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px', // Load more before reaching the end
    triggerOnce: false,
  });

  // Debounce the inView value to prevent rapid changes
  const [debouncedInView] = useDebounce(inView, 200);

  // Memoized load more function
  const loadMore = useCallback(() => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) {
      shouldLoadMore.current = true;
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  // Load more posts when sentinel is visible with debounce
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
