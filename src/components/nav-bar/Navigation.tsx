'use client';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import React, { useTransition } from 'react';
import { logOut } from '@/app/api/auth/actions';
import { Home, Bell, User, LogOut, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import ProfileOverview from './ProfileOverview';
import LoaderPlaceholder from '../loader/LoaderPlaceholder';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLogOut() {
    startTransition(async () => {
      try {
        const result = await logOut();
        if (result.success) {
          router.replace('/');
        }
      } catch (error) {
        toast.error('An error occurred during logout');
      }
    });
  }

  const navItems = [
    { href: '/home', icon: Home, label: 'Home', color: 'bg-sky-500' },
    {
      href: '/notifications',
      icon: Bell,
      label: 'Alerts',
      color: 'bg-indigo-500',
    },
    { href: '/profile', icon: User, label: 'Profile', color: 'bg-mint-500' },
    {
      href: '/create',
      icon: PlusCircle,
      label: 'Create',
      color: 'bg-rose-500',
    },
  ];

  return (
    <nav className="shadow-md flex flex-col items-center py-10 px-6 gap-12 dark:bg-gray-800 bg-white rounded-r-2xl">
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-500 opacity-75 blur-sm"></div>
        <Link
          href="/home"
          className="relative flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full text-2xl font-bold shadow-md"
        >
          <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 text-transparent bg-clip-text">
            🔥
          </span>
        </Link>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-6">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={<item.icon size={24} />}
            color={item.color}
            isActive={pathname === item.href}
            label={item.label}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 items-center justify-center">
        {/* Profile Overview */}
        <ProfileOverview />
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Logout Button */}
        {isPending ? (
          <LoaderPlaceholder />
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogOut}
            className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 shadow-lg hover:shadow-sky-300/20 transition-all duration-300"
          >
            <LogOut size={20} className="text-white" />
          </motion.button>
        )}
      </div>
    </nav>
  );
}

// Reusable Nav Item Component
function NavItem({
  href,
  icon,
  color,
  isActive,
  label,
}: {
  href: string;
  icon: React.JSX.Element;
  color: string;
  isActive: boolean;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative group"
    >
      <Link href={href}>
        <div
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            isActive
              ? `${color} shadow-md scale-110`
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <div
            className={`${isActive ? 'text-white scale-110' : 'text-gray-600 dark:text-gray-300'}`}
          >
            {icon}
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute left-full ml-4 px-3 py-1 dark:bg-gray-800 bg-white text-gray-700 dark:text-gray-300 text-sm rounded-md shadow-md opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50">
          {label}
        </div>
      </Link>
    </motion.div>
  );
}
