const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

// Constants for activity tracking
const ACTIVITY_THRESHOLDS = {
  UPDATE_LAST_ACTIVE_MINUTES: 5, // if (n) minutes have passed, trigger update
} as const;

const HOME_PAGE_POSTS_FILTERS = ['forYou', 'following', 'trending'] as const;
export type HomePagePostsFilter = (typeof HOME_PAGE_POSTS_FILTERS)[number];

const CACHE_TAGS = {
  // Main resource types
  POSTS: 'posts',
  COMMENTS: 'comments',

  // Specific resources (for targeted invalidation)
  POST: (id: string) => `post:${id}`,
  PROFILE: (id: string) => `profile:${id}`,
  PROFILE_POSTSCOUNT: (id: string) => `profile:${id}:postsCount`,
};
const CACHE_DURATION = {
  NEVER: false,
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

export {
  MONTHS,
  ACTIVITY_THRESHOLDS,
  CACHE_TAGS,
  CACHE_DURATION,
  HOME_PAGE_POSTS_FILTERS,
};
