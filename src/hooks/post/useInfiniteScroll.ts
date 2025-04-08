'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetcher } from '@/lib/fetcher';
import { PaginatedData } from '@/types/api';

type UseInfiniteScrollOptions = {
  endpoint: string;
  filter: string;
  queryKey: string[];
};

export default function useInfiniteScroll<T>({
  endpoint,
  filter,
  queryKey,
}: UseInfiniteScrollOptions) {
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
    PaginatedData<T>,
    Error,
    { pages: PaginatedData<T>[] },
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
    refetchOnMount: 'always',
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: false,
  });
  // Extract posts from all pages
  const result = data?.pages?.flatMap((page) => page.data) || [];

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
    result,
    error,
    isLoading: isFetching && !isFetchingNextPage && result.length === 0,
    isFetchingNextPage,
    isEmpty: result.length === 0 && !isFetching,
    isReachingEnd: !hasNextPage,
    isError,
    sentinelRef: ref,
    fetchNextPage: loadMore,
    refetch,
  };
}
