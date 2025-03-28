export type ApiResponse<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ApiError };

// Unified error type
export type ApiError = {
  message: string;
  fields?: Record<string, string>; // Optional field-specific errors
};
