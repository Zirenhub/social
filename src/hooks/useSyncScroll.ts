"use client";

import { useEffect } from "react";

export default function useSyncScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const sidebar = ref.current;
    const mainContent = document.getElementById("main-content");
    if (!sidebar || !mainContent) return;

    let lastScrollTop = mainContent.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = mainContent.scrollTop;
      const delta = currentScrollTop - lastScrollTop;
      lastScrollTop = currentScrollTop;

      requestAnimationFrame(() => {
        const newScrollTop = Math.max(
          0,
          Math.min(sidebar.scrollHeight - sidebar.clientHeight, sidebar.scrollTop + delta * 0.5)
        );
        sidebar.scrollTop = newScrollTop;
      });
    };

    // Initial setup
    sidebar.scrollTop = 0;
    mainContent.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mainContent.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);
}
