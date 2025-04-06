'use client';
import { useEffect } from 'react';

export default function useSyncScroll(
  ref: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const sidebar = ref.current;
    const mainContent = document.getElementById('main-content');
    if (!sidebar || !mainContent) return;

    let lastScrollTop = mainContent.scrollTop;
    const stickyTop = parseInt(window.getComputedStyle(sidebar).top, 10) || 0;
    const handleScroll = () => {
      const currentScrollTop = mainContent.scrollTop;
      const sidebarRect = sidebar.getBoundingClientRect();

      // Only sync after reaching sticky position
      if (sidebarRect.top > stickyTop) {
        sidebar.scrollTop = 0;
        lastScrollTop = currentScrollTop;
        return;
      }

      requestAnimationFrame(() => {
        const delta = currentScrollTop - lastScrollTop;
        lastScrollTop = currentScrollTop;
        sidebar.scrollTop = Math.max(
          0,
          Math.min(
            sidebar.scrollHeight - sidebar.clientHeight,
            sidebar.scrollTop + delta
          )
        );
      });
    };

    // Initial setup
    sidebar.scrollTop = 0;
    mainContent.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mainContent.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
