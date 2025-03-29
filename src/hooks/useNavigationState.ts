// useNavigationState.ts
import { GetUserType } from '@/types/auth';
import { CUTOFF_LEVELS, NAVIGATION_CONFIG } from '@/types/constants';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';

export default function useNavigationState(user: GetUserType) {
  const isMounted = useRef(true);
  const [state, setState] = useState({
    isExpanded: false,
    activeLevel: 'FULL' as keyof typeof CUTOFF_LEVELS,
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoized nav items
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

  // Stable resize handler
  const resizeHandler = useCallback(() => {
    if (!isMounted.current) return;

    const height = window.innerHeight;
    let newLevel: keyof typeof CUTOFF_LEVELS = 'FULL';

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
  }, []);

  // Debounced resize with cleanup
  const [debouncedResize, { cancel }] = useDebounce(resizeHandler, 150);
  useEffect(() => () => cancel(), [cancel]);

  // Memoized items calculation
  const { visibleItems, hiddenItems } = useMemo(() => {
    const maxPriority = {
      ULTRA_MINIMAL: 1,
      MINIMAL: 2,
      COMPACT: 3,
      REDUCED: 3,
      FULL: Infinity,
    }[state.activeLevel];

    const visible = navItems.filter(
      (item) =>
        item.priority <= maxPriority &&
        (state.activeLevel === 'FULL' || item.label !== 'Create')
    );

    return {
      visibleItems: visible,
      hiddenItems: navItems.filter((item) => !visible.includes(item)),
    };
  }, [navItems, state.activeLevel]);

  // Safe state updates
  const toggleExpanded = useCallback(() => {
    isMounted.current &&
      setState((prev) => ({
        ...prev,
        isExpanded: !prev.isExpanded,
      }));
  }, []);

  const toggleIsMounted = () => {
    isMounted.current = true;
  };

  return {
    state,
    visibleItems,
    hiddenItems,
    handleResize: debouncedResize,
    toggleExpanded,
    toggleIsMounted,
  };
}
