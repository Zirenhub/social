import { format, formatDistance, isSameDay } from "date-fns";

export function formatJoinedDate(createdAt: Date | undefined) {
  if (!createdAt) return null;

  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatCreatedAtDate(createdAt: Date, include?: { hour: boolean }) {
  const currentDate = new Date();
  const within24Hours = isSameDay(currentDate, createdAt);

  if (within24Hours) {
    return formatDistance(createdAt, new Date(), {
      addSuffix: true,
      includeSeconds: true,
    });
  }

  return format(createdAt, `MMM d, yyyy${include?.hour ? " • h:mm a" : ""}`);
}
