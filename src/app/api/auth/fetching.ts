import { prisma } from "@/lib/prisma";
import { GetUserType } from "@/types/auth";
import { errorResponse } from "../response";

export const getUser = async (userId: string): Promise<GetUserType> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: { profile: true },
    });
    if (!user || !user.profile) {
      throw new Error("Failed to find user");
    }
    const { hashedPassword, profile, ...safeUser } = user;

    return { ...safeUser, profile };
  } catch (error) {
    const err = errorResponse(error, "Something went wrong getting user");
    throw new Error(err.error.message);
  }
};
