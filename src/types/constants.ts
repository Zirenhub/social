import { Bell, GridIcon, HeartIcon, Home, LucideIcon, PlusCircle, Repeat2Icon, SearchIcon, User } from "lucide-react";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type Filters<T> = {
  label: string;
  tooltip?: string;
  url: T;
};

// HOME PAGE -----------------------------------------------------------

export const HOME_PAGE_POSTS_FILTERS = ["forYou", "following", "trending"] as const;
export type HomePagePostsFilter = (typeof HOME_PAGE_POSTS_FILTERS)[number];
export const homeFilters: Filters<HomePagePostsFilter>[] = [
  { label: "For You", url: "forYou", tooltip: "Posts picked just for you!" },
  {
    label: "Following",
    url: "following",
    tooltip: "Posts from profiles you follow!",
  },
  { label: "Trending", url: "trending", tooltip: "Trending posts! >= 1 like" },
] as const;

// PROFILE PAGE -----------------------------------------------------------

export const PROFILE_PAGE_POSTS_FILTERS = ["posts", "liked", "reposts"] as const;
export type ProfilePagePostsFilter = (typeof PROFILE_PAGE_POSTS_FILTERS)[number];
export const profileFilters: Filters<ProfilePagePostsFilter>[] = [
  { label: "Posts", url: "posts" },
  { label: "Likes", url: "liked" },
  { label: "Reposts", url: "reposts" },
] as const;

// NAVIGATION  -----------------------------------------------------------

export const MOBILE_BREAKPOINT = 768 as const;

//Viewport height breakpoints for different navigation states
export const CUTOFF_LEVELS = {
  HEIGHT: {
    ULTRA_MINIMAL: 500,
    MINIMAL: 600,
    COMPACT: 650,
    REDUCED: 700,
    FULL: Infinity,
  },
  WIDTH: {
    ULTRA_MINIMAL: 150, // e.g., very small phones
    MINIMAL: 225, // typical mobile width
    COMPACT: 270, // large phones, small tablets
    REDUCED: 300, // tablets / small desktops
    FULL: Infinity, // full width
  },
} as const;

export const NAV_CUTOFF_KEYS = ["ULTRA_MINIMAL", "MINIMAL", "COMPACT", "REDUCED", "FULL"] as const;

export type CutoffLevel = (typeof NAV_CUTOFF_KEYS)[number];

// Navigation items with priority levels and metadata
// Priority determines display order and cutoff behavior
export const NAVIGATION_CONFIG = {
  HOME: {
    priority: 1,
    href: "/home",
    icon: Home,
    label: "Home",
    color: "bg-sky-500",
    critical: true,
  },
  PROFILE: {
    priority: 2,
    href: null,
    icon: User,
    label: "Profile",
    color: "bg-orange-500",
    critical: true,
  },
  ALERTS: {
    priority: 3,
    href: "/notifications",
    icon: Bell,
    label: "Alerts",
    color: "bg-indigo-500",
  },
  CREATE: {
    priority: 4,
    href: "/create",
    icon: PlusCircle,
    label: "Create",
    color: "bg-rose-500",
  },
  SEARCH: {
    priority: 4,
    href: "/search",
    icon: SearchIcon,
    label: "Search",
    color: "bg-blue-500",
  },
} as const;

export type NavigationItem = (typeof NAVIGATION_CONFIG)[keyof typeof NAVIGATION_CONFIG];

// SERVER -------------------------------------------------------------

export const PER_PAGE = 10 as const;

// Constants for activity tracking
export const ACTIVITY_THRESHOLDS = {
  UPDATE_LAST_ACTIVE_MINUTES: 5, // if (n) minutes have passed, trigger update
} as const;

export const CACHE_TAGS = {
  POSTS: "posts",

  // Specific resources (for targeted invalidation)
  SEARCH: (query: string) => `search:${query}`,
  HOME_POSTS: (filter: HomePagePostsFilter) => `home:${filter}`,
  POST: (id: string) => `post:${id}`,
  COMMENTS: (postId: string) => `comments:${postId}`,
  PROFILE: (id: string) => `profile:${id}`,
  PROFILE_ACTIVITY: (id: string) => `profile:activity:${id}`,
  PROFILE_POSTS: (id: string, filter: string) => `profile:${id}:posts:${filter}`,
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
