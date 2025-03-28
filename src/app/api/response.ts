import { ApiResponse } from '@/types/api';
import { Prisma } from '@prisma/client';
import { AuthError } from 'next-auth';
import { ZodError } from 'zod';

export default function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  };
}

export function errorResponse(
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred'
): ApiResponse<null> {
  // Base error response
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: { message: defaultMessage },
  };

  if (error instanceof AuthError) {
    switch (error.type) {
      // fix case "CredentialsSignin" not taking this path
      case 'CredentialsSignin':
        response.error.message = 'Invalid email or password.';
      default:
        response.error.message = 'Something went wrong. Please try again.';
    }
    return response;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    response.error.message = error.message;
  }
  // Check for DateTime validation errors specifically
  if (error instanceof Error) {
    if (error.message.includes('Expected ISO-8601 DateTime')) {
      response.error.message =
        'Invalid date format provided. Please use a valid date.';
    }
    return response;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    response.error.message = 'Invalid data provided.';
    return response;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    response.error.message = getPrismaErrorMessage(error);
    return response;
  }
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const { fieldErrors } = error.flatten();

    // Create a user-friendly message
    // response.error.message = 'Please check the form for errors';

    // Add field-specific errors
    if (Object.keys(fieldErrors).length > 0) {
      response.error.fields = {};

      // Convert Zod's field errors to our format
      for (const [field, errors] of Object.entries(fieldErrors)) {
        if (errors?.length) {
          response.error.fields[field] = errors[0];
        }
      }
    }
    return response;
  }

  return response;
}

// Helper function to get prisma-specific error messages
function getPrismaErrorMessage(
  error: Prisma.PrismaClientKnownRequestError
): string {
  switch (error.code) {
    case 'P2002':
      return `This ${error.meta?.target} is already in use.`;
    case 'P2025':
      return `Record not found.`;
    case 'P2003':
      return `Referenced record not found.`;
    // Add more detailed handling for specific validation error codes
    case 'P2007': // validation error
      if (error.message.includes('DateTime')) {
        return 'Invalid date format. Please provide a valid date.';
      }
      return `Validation error: ${error.message}`;
    default:
      return `Database error: ${error.message}`;
  }
}
