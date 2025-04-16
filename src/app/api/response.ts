import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { ZodError } from "zod";

import { ApiError, ApiErrorType, ApiResponse } from "@/types/api";

/**
 * Success response generator function
 * @param data - The successful data to be returned
 * @returns ApiResponse with success set to true
 */
export default function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  };
}

/**
 * Error response generator function that handles different error types
 * @param error - The error encountered
 * @param defaultMessage - Default error message if no specific message is available
 * @returns ApiResponse with success set to false
 */
export function errorResponse(
  error: unknown,
  defaultMessage: string = "An unexpected error occurred"
): { success: false; data: null; error: ApiErrorType } {
  const response: ApiError = {
    success: false,
    data: null,
    error: { message: defaultMessage },
  };

  // Handle specific error types and modify the response accordingly

  if (error instanceof AuthError) {
    response.error.message =
      error.type === "CredentialsSignin" ? "Invalid email or password." : "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    response.error.message = error.message;

    // Handle DateTime validation errors specifically
    if (error.message.includes("Expected ISO-8601 DateTime")) {
      response.error.message = "Invalid date format provided. Please use a valid date.";
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    response.error.message = "Invalid data provided.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    response.error.message = getPrismaErrorMessage(error);
  }

  if (error instanceof ZodError) {
    const { fieldErrors } = error.flatten();
    response.error.message = "Please check the form for errors";

    if (Object.keys(fieldErrors).length > 0) {
      response.error.fields = Object.entries(fieldErrors).reduce(
        (acc, [field, errors]) => {
          if (errors?.length) acc[field] = errors[0];
          return acc;
        },
        {} as Record<string, string>
      );
    }
  }

  return response;
}

/**
 * Helper function to get Prisma-specific error messages
 * @param error - The Prisma error encountered
 * @returns The appropriate error message based on the Prisma error code
 */
function getPrismaErrorMessage(error: Prisma.PrismaClientKnownRequestError): string {
  switch (error.code) {
    case "P2002":
      return `This ${error.meta?.target} is already in use.`;
    case "P2025":
      return "Not found.";
    case "P2003":
      return "Referenced record not found.";
    case "P2007": // Validation error
      return error.message.includes("DateTime")
        ? "Invalid date format. Please provide a valid date."
        : `Validation error: ${error.message}`;
    default:
      return `Database error: ${error.message}`;
  }
}
