"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MoreVertical } from "lucide-react";

import useNavigationState from "@/hooks/useNavigationState";
import { GetProfileType } from "@/types/profile";

// Removed: import { useMobile } from '@/context/MobileProvider';

const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher"), { ssr: false });
const LogOut = dynamic(() => import("./LogOut"), { ssr: false });

type Props = { profile: GetProfileType };

// --- NavItem Component (Modified Tooltip Visibility) ---
const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="relative group z-50 flex-shrink-0" // Added flex-shrink-0 for mobile
  >
    <Link href={item.href} className={isActive ? "pointer-events-none" : ""}>
      {/* Icon container: Adjust size responsively */}
      <div
        className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
          isActive
            ? `${item.color} shadow-md md:scale-110` // Apply scale boost only on desktop active
            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {/* Icon: Adjust size responsively if needed, using text size potentially */}
        <div
          className={
            isActive
              ? "text-white md:scale-110" // Apply scale boost only on desktop active
              : "text-gray-600 dark:text-gray-300"
          }
        >
          {/* Responsive icon size */}
          <item.icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>

      {/* Tooltip: Hidden on mobile, visible on desktop hover */}
      <div className="absolute left-0 md:left-full top-auto bottom-full md:bottom-auto md:top-1/2 md:-translate-y-1/2 mb-2 md:mb-0 ml-0 md:ml-4 px-3 py-1 dark:bg-gray-800 bg-white text-gray-700 dark:text-gray-300 text-sm rounded-md shadow-md opacity-0 -translate-x-1/2 md:translate-x-[-8px] pointer-events-none group-hover:md:opacity-100 group-hover:md:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 hidden md:block">
        {item.label}
      </div>
    </Link>
  </motion.div>
);

// --- DropdownMenu Component (Consider adding responsive icon size) ---
const DropdownMenu = ({
  hiddenItems,
  pathname,
  itemClass,
}: {
  hiddenItems: any[];
  pathname: string;
  itemClass: string;
}) => (
  <>
    {hiddenItems.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm md:text-base ${
            // Responsive text size
            isActive ? `${item.color} text-white` : itemClass
          }`}
        >
          {/* Responsive icon size (using class directly) */}
          <item.icon className="w-4 h-4 md:w-5 md:h-5" />
          <span>{item.label}</span>
        </Link>
      );
    })}
  </>
);

// --- Main Navigation Component (Responsive) ---
export default function Navigation({ profile }: Props) {
  const { state, toggleExpanded, visibleItems, hiddenItems, handleResize } = useNavigationState(profile);
  const pathname = usePathname();
  console.log("navigation mounted");
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    const resizeObserver = new ResizeObserver(handleResize);
    if (mainContent) {
      resizeObserver.observe(mainContent);
    }

    return () => {
      if (mainContent) {
        resizeObserver.unobserve(mainContent);
      }
      resizeObserver.disconnect();
    };
    // Added handleResize and state.activeLevel as dependencies for height recalc
  }, [handleResize, state.activeLevel]);

  return (
    <>
      <nav
        id="navigation"
        className="
          fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-[#1d1620] shadow-md border-t border-gray-200 dark:border-gray-700 px-2 py-2
          md:relative md:inset-auto md:w-18 md:h-full md:flex md:flex-col md:items-center md:py-10 md:px-4 md:gap-12 md:border-t-0 md:border-r md:dark:border-gray-700 md:shadow-md md:transition-all md:duration-300 md:ease-in-out
        "
      >
        {/* Logo: Desktop only */}
        <div className="hidden md:block relative">
          {" "}
          {/* Added relative for positioning context */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative" // Ensure motion div is relative
          >
            {/* Blur effect absolutely positioned */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-500 opacity-75 blur-sm" />
            <Link
              href="/home"
              className="relative flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full text-2xl font-bold shadow-md"
            >
              <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 text-transparent bg-clip-text">
                🔥
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Items & More Button Container */}
        {/* Mobile: Row, space between. Desktop: Column, centered items */}
        <div className="flex justify-around items-center w-full max-w-3xl mx-auto md:flex-col md:justify-start md:gap-6 md:max-w-none md:w-auto md:mx-0 md:mt-0">
          {visibleItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              // Tooltip handled internally by NavItem now
            />
          ))}

          {/* "More" Button and Dropdown */}
          {state.activeLevel !== "FULL" && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05, md: { scale: 1.1 } }} // Different hover scale
                whileTap={{ scale: 0.95, md: { scale: 0.9 } }} // Different tap scale
                onClick={toggleExpanded}
                className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
                  state.isExpanded
                    ? "bg-rose-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {/* Responsive Icon Size */}
                <MoreVertical className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>

              <AnimatePresence>
                {state.isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: "-50%", md: { x: -20, y: 0 } }} // Mobile: from bottom, centered. Desktop: from left
                    animate={{ opacity: 1, y: 0, x: "-50%", md: { x: 0, y: 0 } }}
                    exit={{ opacity: 0, y: 20, x: "-50%", md: { x: -20, y: 0 } }}
                    transition={{ duration: 0.2 }}
                    // Mobile: Above button, centered. Desktop: Right of button, top-aligned
                    className="absolute bottom-full mb-2 left-1/2 md:bottom-auto md:left-full md:top-0 md:mb-0 md:ml-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[180px] md:min-w-[200px] z-50"
                    // style added to prevent potential initial flicker with transform
                    style={{ transform: "translateX(-50%)" }} // Set initial mobile transform
                    // Apply desktop transform override using style - Tailwind class might conflict with framer-motion
                    // Alternatively, handle transform within framer motion variants per breakpoint if needed
                    // Or ensure no conflicting transform classes are applied by default on desktop
                    // Correct approach: Framer motion handles the x/y. Use md: variants for positioning classes like md:left-full etc.
                    // Removed translateX(-50%) from className, using motion props.
                  >
                    <DropdownMenu
                      hiddenItems={hiddenItems}
                      pathname={pathname}
                      itemClass="hover:bg-gray-100 dark:hover:bg-gray-700"
                      // Size handled internally now
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom Section: Desktop only */}
        <div className="hidden md:flex mt-auto flex-col gap-3 items-center justify-center">
          <ThemeSwitcher />
          <LogOut />
        </div>
      </nav>
    </>
  );
}
