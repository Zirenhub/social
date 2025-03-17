import { formatDistance } from 'date-fns';

export function formatJoinedDate(createdAt: Date) {
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
