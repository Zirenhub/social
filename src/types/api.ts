import { Prisma } from '@prisma/client';

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

export type SessionUser = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
  omit: { hashedPassword: true };
}>;
