"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import { HeaderProps, useHeader } from "@/context/HeaderProvider";
import { useIsMobile } from "@/context/MobileProvider";
import { GetProfileType } from "@/types/profile";
import Avatar from "../Avatar";

// HeaderSlot - Client component that can be used in server components

function MobileHeaderUpdater({ content, avatar = true }: HeaderProps) {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader(content, avatar);

    return () => {
      setHeader(null);
    };
  }, [content, avatar]);

  return null;
}

export function HeaderSlot({ content, avatar = true, fallback }: HeaderProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return fallback ? <>{fallback}</> : null;
  }

  return <MobileHeaderUpdater content={content} avatar={avatar} />;
}

const Profile = dynamic(() => import("./sidebar/Profile"), {
  loading: () => null,
});

type MobileHeaderProps = {
  profile: GetProfileType;
};

function MobileHeaderComponent({ profile }: MobileHeaderProps) {
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { header } = useHeader();

  const handleScroll = useCallback(
    (main: HTMLElement) => {
      const currentScrollY = main.scrollTop;
      const scrollDown = currentScrollY > lastScrollY.current;

      if (scrollDown && currentScrollY > 50) {
        if (showHeader) {
          setShowHeader(false);
        }
      } else {
        if (!showHeader) {
          setShowHeader(true);
        }
      }
      lastScrollY.current = currentScrollY;
    },
    [showHeader]
  );

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    const scrollListener = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          handleScroll(main);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    main.addEventListener("scroll", scrollListener, { passive: true });
    return () => main?.removeEventListener("scroll", scrollListener);
  }, [handleScroll]);

  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.clientHeight);
  }, [headerRef, header]);

  const closeSidebar = useCallback(() => setSidebar(false), []);
  const openSidebar = useCallback(() => setSidebar(true), []);

  if (!header) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {sidebar && (
          <>
            <Profile profile={profile} />
            <motion.div
              onClick={closeSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-[60] bg-black/20 dark:bg-white/10"
              style={{ willChange: "opacity" }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.header
        ref={headerRef}
        initial={false}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50",
          "flex flex-col",
          "transition-transform duration-300", //  backdrop-blur-xl
          "border-b border-gray-200/80 dark:border-gray-800",
          "bg-white/80 dark:bg-gray-800 shadow-sm",
          "p-2 w-full"
        )}
        style={{ willChange: "transform" }}
      >
        {header.avatar && (
          <div onClick={openSidebar}>
            <Avatar profile={profile} />
          </div>
        )}
        <div className="w-full">{header.content}</div>
      </motion.header>
      <div className="block" style={{ height: headerHeight || 0 }} />
    </>
  );
}

export default React.memo(MobileHeaderComponent);
