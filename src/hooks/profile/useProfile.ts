'use client';
import { fetcher } from '@/lib/fetcher';
import { CACHE_TAGS } from '@/types/constants';
import { GetProfileType } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';

export default function useProfile(id: string, enabled: boolean = true) {
  const { data, error, isLoading, refetch } = useQuery<GetProfileType, Error>({
    queryKey: [CACHE_TAGS.PROFILE(id)],
    queryFn: () => fetcher(`/api/profile/${id}`),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  return {
    profile: data,
    isLoading,
    error,
    refetch,
  };
}
