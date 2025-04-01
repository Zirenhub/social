import { formatDistance } from 'date-fns';

export function formatJoinedDate(createdAt: Date | undefined) {
  if (!createdAt) return null;

  return new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatCreatedAtDate(createdAt: Date) {
  return formatDistance(createdAt, new Date(), {
    addSuffix: true,
    includeSeconds: true,
  });
}
