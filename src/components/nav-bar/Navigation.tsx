'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import LogOut from './LogOut';
import { SessionUser } from '@/types/api';
import useNavigationState from '@/hooks/useNavigationState';

type Props = {
  user: SessionUser;
};

export default function Navigation({ user }: Props) {
  const {
    state,
    toggleExpanded,
    visibleItems,
    hiddenItems,
    handleResize,
    toggleIsMounted,
  } = useNavigationState(user);
  const pathname = usePathname();

  // Setup ResizeObserver for better performance than window events
  useEffect(() => {
    toggleIsMounted(); // in case navigation gets unmounted, remount
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(document.documentElement);
    return () => resizeObserver.disconnect();
  }, [handleResize]);

  return (
    <nav
      className="shadow-md flex flex-col items-center py-10 px-6 gap-12 
                 dark:bg-[#1d1620] bg-white h-full w-18 relative
                 transition-all duration-300 ease-in-out"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
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

      {/* Main Navigation Items */}
      <div className="flex flex-col gap-6">
        {visibleItems.map((item) => (
          <motion.div
            key={item.href}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative group z-50"
          >
            <Link
              href={item.href}
              className={pathname === item.href ? 'pointer-events-none' : ''}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full 
     transition-all duration-300 ${
       pathname === item.href
         ? `${item.color} shadow-md scale-110`
         : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
     }`}
              >
                <div
                  className={
                    pathname === item.href
                      ? 'text-white scale-110'
                      : 'text-gray-600 dark:text-gray-300'
                  }
                >
                  {<item.icon size={24} />}
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-1 dark:bg-gray-800 bg-white text-gray-700 dark:text-gray-300 text-sm rounded-md shadow-md opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          </motion.div>
        ))}

        {/* More Button and Dropdown */}
        {state.activeLevel !== 'FULL' && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleExpanded}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                state.isExpanded
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <MoreVertical size={24} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {state.isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full top-0 ml-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[200px] z-50"
                >
                  {hiddenItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                        pathname === item.href
                          ? `${item.color} text-white`
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-3 items-center justify-center">
        <ThemeSwitcher />
        <LogOut />
      </div>
    </nav>
  );
}
