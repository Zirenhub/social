import prisma from '@/lib/prisma';
import { errorResponse } from '../response';
import { getProfile } from '../profile/fetching';
import { GetProfileType } from '@/types/profile';
import getSession from '@/lib/getSession';

export const getSearchProfiles = async (query: string) => {
  try {
    const session = await getSession();
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
      const profile = await getProfile({
        profileId: id,
        userProfileId: session.user.profile,
      });
      profiles.push(profile);
    }

    return profiles;
  } catch (error) {
    const err = errorResponse(
      error,
      'Something went wrong getting serach results.'
    );
    throw new Error(err.error?.message);
  }
};
