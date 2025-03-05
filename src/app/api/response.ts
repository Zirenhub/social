import { ApiResponse } from '@/types/api';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
  message: string
): ApiResponse<null> {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          success: false,
          data: null,
          error: {
            message: `The value for ${error.meta?.target} is already in use.`,
          },
        };
      case 'P2025':
        return {
          success: false,
          data: null,
          error: {
            message: error.message,
          },
        };
      case 'P2003':
        return {
          success: false,
          data: null,
          error: {
            message: `Foreign key constraint failed on the field: ${error.meta?.field_name}`,
          },
        };
      case 'P2004':
        return {
          success: false,
          data: null,
          error: {
            message: `A constraint failed on the database: ${error.meta?.database_name}`,
          },
        };
      case 'P2005':
        return {
          success: false,
          data: null,
          error: {
            message: `The value provided for the field is invalid: ${error.meta?.field_name}`,
          },
        };
      case 'P2006':
        return {
          success: false,
          data: null,
          error: {
            message: `The provided value for ${error.meta?.model_name} is not valid.`,
          },
        };
      case 'P2007':
        return {
          success: false,
          data: null,
          error: {
            message: `Data validation error: ${error.meta?.details}`,
          },
        };
      case 'P2008':
        return {
          success: false,
          data: null,
          error: {
            message: `Failed to parse the query: ${error.meta?.query}`,
          },
        };
      case 'P2009':
        return {
          success: false,
          data: null,
          error: {
            message: `Failed to validate the query: ${error.meta?.query}`,
          },
        };
      case 'P2010':
        return {
          success: false,
          data: null,
          error: {
            message: `Raw query failed: ${error.meta?.query}. Code: ${error.meta?.code}`,
          },
        };
      case 'P2011':
        return {
          success: false,
          data: null,
          error: {
            message: `Null constraint violation on the ${error.meta?.constraint}`,
          },
        };
      case 'P2012':
        return {
          success: false,
          data: null,
          error: {
            message: `Missing a required value: ${error.meta?.field_name}`,
          },
        };
      case 'P2013':
        return {
          success: false,
          data: null,
          error: {
            message: `Missing the required argument: ${error.meta?.argument_name}`,
          },
        };
      case 'P2014':
        return {
          success: false,
          data: null,
          error: {
            message: `The change you are trying to make would violate the required relation: ${error.meta?.relation_name}`,
          },
        };
      case 'P2015':
        return {
          success: false,
          data: null,
          error: {
            message: `A related record could not be found: ${error.meta?.details}`,
          },
        };
      case 'P2016':
        return {
          success: false,
          data: null,
          error: {
            message: `Query interpretation error: ${error.meta?.details}`,
          },
        };
      case 'P2017':
        return {
          success: false,
          data: null,
          error: {
            message: `The records for relation ${error.meta?.relation_name} are not connected.`,
          },
        };
      case 'P2018':
        return {
          success: false,
          data: null,
          error: {
            message: `The required connected records were not found: ${error.meta?.details}`,
          },
        };
      case 'P2019':
        return {
          success: false,
          data: null,
          error: {
            message: `Input error: ${error.meta?.details}`,
          },
        };
      case 'P2020':
        return {
          success: false,
          data: null,
          error: {
            message: `Value out of range for the type: ${error.meta?.field_name}`,
          },
        };
      case 'P2021':
        return {
          success: false,
          data: null,
          error: {
            message: `The table does not exist in the current database: ${error.meta?.table}`,
          },
        };
      case 'P2022':
        return {
          success: false,
          data: null,
          error: {
            message: `The column does not exist in the current database: ${error.meta?.column}`,
          },
        };
      case 'P2023':
        return {
          success: false,
          data: null,
          error: {
            message: `Inconsistent column data: ${error.meta?.details}`,
          },
        };
      default:
        return {
          success: false,
          data: null,
          error: {
            message: `An unknown error occurred: ${error.message}`,
          },
        };
    }
  }

  if (error instanceof ZodError) {
    const { fieldErrors } = error.flatten();

    const formattedErrors = Object.keys(fieldErrors).reduce<
      Record<string, { message: string }>
    >(
      (acc, field) => {
        if (fieldErrors[field]?.length) {
          acc[field] = { message: fieldErrors[field][0] };
        }
        return acc;
      },
      {} // Explicitly typed accumulator as Record<string, { message: string }>
    );

    return {
      success: false,
      data: null,
      error: formattedErrors, // Directly associate errors with their fields
    };
  }

  return {
    success: false,
    data: null,
    error: { message },
  };
}
