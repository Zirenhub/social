import {
  Bell,
  GridIcon,
  HeartIcon,
  Home,
  LucideIcon,
  PlusCircle,
  Repeat2Icon,
  User,
} from 'lucide-react';

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

// NAVIGATION  -----------------------------------------------------------

//Viewport height breakpoints for different navigation states
export const CUTOFF_LEVELS = {
  ULTRA_MINIMAL: 500, // Extreme space saving - only most critical
  MINIMAL: 600, // Very limited space - essential only
  COMPACT: 650, // Reduced space - core features
  REDUCED: 700, // Standard compact - most features
  FULL: Infinity, // Full experience - all features
} as const;

//  Navigation items with priority levels and metadata
// Priority determines display order and cutoff behavior
export const NAVIGATION_CONFIG = {
  HOME: {
    priority: 1,
    href: '/home',
    icon: Home,
    label: 'Home',
    color: 'bg-sky-500',
    critical: true,
  },
  PROFILE: {
    priority: 2,
    icon: User,
    label: 'Profile',
    color: 'bg-orange-500',
    critical: true,
  },
  ALERTS: {
    priority: 3,
    href: '/notifications',
    icon: Bell,
    label: 'Alerts',
    color: 'bg-indigo-500',
  },
  CREATE: {
    priority: 4,
    href: '/create',
    icon: PlusCircle,
    label: 'Create',
    color: 'bg-rose-500',
  },
} as const;

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
