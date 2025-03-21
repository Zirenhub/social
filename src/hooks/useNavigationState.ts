import { SessionUser } from '@/types/api';
import { CUTOFF_LEVELS, NAVIGATION_CONFIG } from '@/types/constants';
import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function useNavigationState(user: SessionUser) {
  const [state, setState] = useState({
    isExpanded: false,
    activeLevel: 'FULL' as keyof typeof CUTOFF_LEVELS,
    isMounted: false,
  });

  // Memoize nav items to prevent unnecessary rebuilds
  const navItems = useMemo(
    () =>
      [
        NAVIGATION_CONFIG.HOME,
        { ...NAVIGATION_CONFIG.PROFILE, href: `/profile/${user.profile.id}` },
        NAVIGATION_CONFIG.ALERTS,
        NAVIGATION_CONFIG.CREATE,
      ].sort((a, b) => a.priority - b.priority),
    [user.profile.id]
  );

  // Debounced resize handler using use-debounce
  const [handleResize] = useDebounce(() => {
    const height = window.innerHeight;
    let newLevel: keyof typeof CUTOFF_LEVELS = 'FULL';

    // Determine appropriate level based on viewport height
    switch (true) {
      case height < CUTOFF_LEVELS.ULTRA_MINIMAL:
        newLevel = 'ULTRA_MINIMAL';
        break;
      case height < CUTOFF_LEVELS.MINIMAL:
        newLevel = 'MINIMAL';
        break;
      case height < CUTOFF_LEVELS.COMPACT:
        newLevel = 'COMPACT';
        break;
      case height < CUTOFF_LEVELS.REDUCED:
        newLevel = 'REDUCED';
        break;
    }

    setState((prev) => ({ ...prev, activeLevel: newLevel }));
  }, 150); // 150ms debounce time for optimal performance

  // Memoized visible/hidden items calculation with stricter priority rules
  const { visibleItems, hiddenItems } = useMemo(() => {
    const maxPriority = {
      ULTRA_MINIMAL: 1, // Only Home
      MINIMAL: 2, // Home + Profile
      COMPACT: 3, // Home + Profile + Alerts
      REDUCED: 3, // Changed from 4 to 3 to ensure Create is always in dropdown when not FULL
      FULL: Infinity,
    }[state.activeLevel];

    // Filter items based on priority and ensure CREATE is hidden unless FULL
    const visible = navItems.filter(
      (item) =>
        item.priority <= maxPriority &&
        (state.activeLevel === 'FULL' || item.label !== 'Create')
    );

    // Everything else goes to hidden items
    const hidden = navItems.filter((item) => !visible.includes(item));

    return { visibleItems: visible, hiddenItems: hidden };
  }, [navItems, state.activeLevel]);

  return { state, setState, visibleItems, hiddenItems, handleResize };
}
