'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { logOut } from '@/app/api/auth/actions';
import { Home, Bell, User, LogOut, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();

  async function handleLogOut() {
    const result = await logOut();
    if (result.success) {
      router.push('/');
    } else {
      toast.error('Failed to log out');
    }
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-24 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center py-8 gap-10 shadow-lg">
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="text-4xl font-bold cursor-pointer"
      >
        <Link href="/" className="text-teal-400">
          🔥
        </Link>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-8 mt-8">
        <NavItem href="/home" icon={<Home size={32} />} color="text-sky-400" />
        <NavItem
          href="/notifications"
          icon={<Bell size={32} />}
          color="text-rose-400"
        />
        <NavItem
          href="/profile"
          icon={<User size={32} />}
          color="text-emerald-400"
        />
        <NavItem
          href="/create"
          icon={<PlusCircle size={32} />}
          color="text-amber-400"
        />
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLogOut}
        className="mt-auto mb-8 p-4 cursor-pointer rounded-full bg-gray-700 hover:bg-rose-600 transition"
      >
        <LogOut size={32} className="text-white" />
      </motion.button>
    </nav>
  );
}

// Reusable Nav Item Component
function NavItem({
  href,
  icon,
  color,
}: {
  href: string;
  icon: React.JSX.Element;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="cursor-pointer"
    >
      <Link
        href={href}
        className={`p-4 rounded-full ${color} hover:bg-opacity-20 transition`}
      >
        {icon}
      </Link>
    </motion.div>
  );
}
