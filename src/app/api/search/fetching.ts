import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { GetProfileType, profileQuery } from "@/types/profile";
import { errorResponse } from "../response";

export const getSearchProfiles = async (query: string): Promise<GetProfileType[]> => {
  try {
    const session = await getSession();
    const userProfileId = session.user.profile;

    // Format query for full-text search
    const formattedQuery = query
      .split(" ")
      .filter((term) => term.length > 2) // Ignore short terms
      .map((term) => `${term}:*`) // Enable prefix matching
      .join(" & ");

    // Perform a single query that includes all the profile data we need
    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          // Full-text search across multiple fields
          { firstName: { search: formattedQuery } },
          { lastName: { search: formattedQuery } },
          { username: { search: formattedQuery } },
        ],
      },
      // Use the same select options from profileQuery
      ...profileQuery(userProfileId),
      orderBy: {
        // Basic relevance sorting
        _relevance: {
          fields: ["firstName", "lastName", "username"],
          search: formattedQuery,
          sort: "desc",
        },
      },
    });

    return profiles;
  } catch (error) {
    const err = errorResponse(error, "Something went wrong getting search results.");
    throw new Error(err.error?.message);
  }
};
