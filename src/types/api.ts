export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error:
    | {
        message: string;
      }
    | Record<
        string,
        {
          message: string;
        }
      >
    | null;
}
