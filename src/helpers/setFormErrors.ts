import { UseFormReturn } from 'react-hook-form';
import { ApiError } from '@/types/api';

/**
 * Sets form errors from an API error response
 *
 * @param formMethods - The form methods from useForm
 * @param apiError - The API error object containing field errors
 * @param shouldFocus - Whether to focus on the first field with an error (default: true)
 */
export function setFormErrors<T extends Record<string, any>>(
  formMethods: UseFormReturn<T>,
  apiError: ApiError | undefined | null,
  shouldFocus: boolean = true
): void {
  // If no error or no field errors, do nothing
  if (!apiError || !apiError.fields) {
    return;
  }

  const fieldEntries = Object.entries(apiError.fields);
  let isFirstError = true;

  fieldEntries.forEach(([field, message]) => {
    // Set the error for each field
    formMethods.setError(field as keyof T, {
      message,
      // Only set `shouldFocus` for the first error if requested
      shouldFocus: shouldFocus && isFirstError,
    });

    if (isFirstError) {
      isFirstError = false;
    }
  });
}
