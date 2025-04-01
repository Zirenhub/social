'use client';
import { createTypedFetcher } from '@/lib/fetcher';
import { GetProfileType } from '@/types/profile';
import useSWR from 'swr';

const profileFetcher = createTypedFetcher<GetProfileType>();

export default function useProfile(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<GetProfileType, Error>(
    id ? `/api/profile/${id}` : null,
    profileFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
  console.log(data);
  return {
    profile: data,
    isLoading,
    isError: error,
    mutate,
  };
}
