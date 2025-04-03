import { ApiResponse } from '@/types/api';

export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const result = (await response.json()) as ApiResponse<T>;

  if (!result.success) {
    const error = new Error(result.error.message || 'An error occurred');
    throw error;
  }

  return result.data;
}
