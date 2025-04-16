import { Path, UseFormReturn } from "react-hook-form";

import { ApiErrorType } from "@/types/api";

/**
 * Sets form errors from an API error response
 *
 * @param formMethods - The form methods from useForm
 * @param apiError - The API error object containing field errors
 * @param shouldFocus - Whether to focus on the first field with an error (default: true)
 */
export function setFormErrors<T extends Record<string, any>>(
  formMethods: UseFormReturn<T>,
  apiError: ApiErrorType | undefined | null,
  shouldFocus: boolean = true
): void {
  if (!apiError?.fields) return;

  const fieldEntries = Object.entries(apiError.fields);
  let firstField: Path<T> | null = null;

  fieldEntries.forEach(([field, message]) => {
    const typedField = field as Path<T>;

    formMethods.setError(typedField, { message });

    if (shouldFocus && !firstField) {
      firstField = typedField;
    }
  });

  if (firstField) {
    formMethods.setFocus(firstField);
  }
}
