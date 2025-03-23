import { prisma } from '@/lib/prisma';
import successResponse, { errorResponse } from '../response';
import { getProfile } from '../profile/fetching';
import { GetProfileType } from '@/types/profile';

export async function getSearchProfiles(query: string) {
  try {
    // Format query for full-text search
    const formattedQuery = query
      .split(' ')
      .filter((term) => term.length > 2) // Ignore short terms
      .map((term) => `${term}:*`) // Enable prefix matching
      .join(' & ');

    const results = await prisma.profile.findMany({
      where: {
        OR: [
          // Full-text search across multiple fields
          { firstName: { search: formattedQuery } },
          { lastName: { search: formattedQuery } },
          { username: { search: formattedQuery } },
        ],
      },
      select: { id: true },
      orderBy: {
        // Basic relevance sorting
        _relevance: {
          fields: ['firstName', 'lastName', 'username'],
          search: formattedQuery,
          sort: 'desc',
        },
      },
    });

    const profiles: GetProfileType[] = [];

    for (const { id } of results) {
      const { success, data, error } = await getProfile(id);
      if (!success || !data) {
        throw new Error(error?.message);
      }
      profiles.push(data);
    }

    return successResponse(profiles);
  } catch (error) {
    return errorResponse(error, 'Something went wrong getting serach results.');
  }
}
