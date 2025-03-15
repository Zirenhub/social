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

const API = {
  PROFILE: {
    LAST_ACTIVE_THRESHOLD_S: 300, // 5 minutes
  },
} as const;

export { MONTHS, API };
