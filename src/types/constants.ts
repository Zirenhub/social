import { GridIcon, HeartIcon, LucideIcon, Repeat2Icon } from 'lucide-react';

export const MONTHS = [
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

// HOME PAGE -----------------------------------------------------------

export const HOME_PAGE_POSTS_FILTERS = [
  'forYou',
  'following',
  'trending',
] as const;
type HomePagePostsFilter = (typeof HOME_PAGE_POSTS_FILTERS)[number];
export const homeFilters: { label: string; url: HomePagePostsFilter }[] = [
  { label: 'For You', url: 'forYou' },
  { label: 'Friends', url: 'following' },
  { label: 'Trending', url: 'trending' },
] as const;

// PROFILE PAGE -----------------------------------------------------------

export const PROFILE_PAGE_POSTS_FILTERS = [
  'posts',
  'liked',
  'reposts',
] as const;
type ProfilePagePostsFilter = (typeof PROFILE_PAGE_POSTS_FILTERS)[number];
export const profileFilters: {
  label: string;
  url: ProfilePagePostsFilter;
  icon: LucideIcon;
}[] = [
  { label: 'Posts', url: 'posts', icon: GridIcon },
  { label: 'Likes', url: 'liked', icon: HeartIcon },
  { label: 'Reposts', url: 'reposts', icon: Repeat2Icon },
] as const;

// SERVER -------------------------------------------------------------

// Constants for activity tracking
export const ACTIVITY_THRESHOLDS = {
  UPDATE_LAST_ACTIVE_MINUTES: 5, // if (n) minutes have passed, trigger update
} as const;

export const CACHE_TAGS = {
  // Main resource types
  POSTS: 'posts',
  COMMENTS: 'comments',

  // Specific resources (for targeted invalidation)
  POST: (id: string) => `post:${id}`,
  PROFILE: (id: string) => `profile:${id}`,
  PROFILE_POSTS: (id: string) => `profile:${id}:posts`,
  PROFILE_POSTSCOUNT: (id: string) => `profile:${id}:postsCount`,
  PROFILE_FOLLOWINGCOUNT: (id: string) => `profile:${id}:followingCount`,
  PROFILE_FOLLOWERSCOUNT: (id: string) => `profile:${id}:followersCount`,
};
export const CACHE_DURATION = {
  NEVER: false,
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};
