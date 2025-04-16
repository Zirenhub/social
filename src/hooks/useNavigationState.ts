import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { CUTOFF_LEVELS, CutoffLevel, NAVIGATION_CONFIG } from "@/types/constants";
import { GetProfileType } from "@/types/profile";

export default function useNavigationState(profile: GetProfileType) {
  const isMounted = useRef(true);
  const [state, setState] = useState({ isExpanded: false, activeLevel: "FULL" as CutoffLevel });

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
        { ...NAVIGATION_CONFIG.PROFILE, href: `/profile/${profile.id}` },
        NAVIGATION_CONFIG.ALERTS,
        NAVIGATION_CONFIG.CREATE,
        NAVIGATION_CONFIG.SEARCH,
      ].sort((a, b) => a.priority - b.priority),
    [profile.id]
  );

  // Stable resize handler
  const resizeHandler = useCallback(() => {
    if (!isMounted.current) return;

    const height = window.innerHeight;
    const width = window.innerWidth;
    let newLevel: CutoffLevel = "FULL";

    switch (true) {
      case height < CUTOFF_LEVELS.HEIGHT.ULTRA_MINIMAL || width < CUTOFF_LEVELS.WIDTH.ULTRA_MINIMAL:
        newLevel = "ULTRA_MINIMAL";
        break;
      case height < CUTOFF_LEVELS.HEIGHT.MINIMAL || width < CUTOFF_LEVELS.WIDTH.MINIMAL:
        newLevel = "MINIMAL";
        break;
      case height < CUTOFF_LEVELS.HEIGHT.COMPACT || width < CUTOFF_LEVELS.WIDTH.COMPACT:
        newLevel = "COMPACT";
        break;
      case height < CUTOFF_LEVELS.HEIGHT.REDUCED || width < CUTOFF_LEVELS.WIDTH.REDUCED:
        newLevel = "REDUCED";
        break;
    }

    setState((prev) => ({ ...prev, activeLevel: newLevel }));
  }, []);

  // Debounced resize with cleanup
  const [debouncedResize, { cancel }] = useDebounce(resizeHandler, 150);
  useEffect(() => () => cancel(), [cancel]);

  // Memoized items calculation
  const { visibleItems, hiddenItems } = useMemo(() => {
    const maxPriority = { ULTRA_MINIMAL: 1, MINIMAL: 2, COMPACT: 3, REDUCED: 3, FULL: Infinity }[state.activeLevel];

    const visible = navItems.filter(
      (item) => item.priority <= maxPriority && (state.activeLevel === "FULL" || item.label !== "Create")
    );

    return { visibleItems: visible, hiddenItems: navItems.filter((item) => !visible.includes(item)) };
  }, [navItems, state.activeLevel]);

  // Safe state updates
  const toggleExpanded = useCallback(() => {
    isMounted.current && setState((prev) => ({ ...prev, isExpanded: !prev.isExpanded }));
  }, []);

  return { state, visibleItems, hiddenItems, handleResize: debouncedResize, toggleExpanded };
}
