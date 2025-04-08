// Unified error type
export type ApiErrorType = {
  message: string;
  fields?: Record<string, string>; // Optional field-specific errors
};

type ApiSuccess<T> = { success: true; data: T; error: null };

export type ApiError = { success: false; data: null; error: ApiErrorType };

export type PaginatedData<T> = {
  data: T[];
  nextCursor: string | null;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
