import { useUser } from '@/context/UserContext';
import { UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../profile/ProfileCard';

export default function ProfileOverview() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  const user = useUser();

  return (
    <div className="flex items-center gap-3 p-3 rounded-full transition-all duration-300 hover:bg-indigo-500/10">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full blur-sm opacity-70" />
        {isOpen && (
          <motion.div
            whileHover={{ scale: 1.1, x: 10 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer absolute top-1/2 left-full -translate-y-1/2 ml-4 bg-white dark:bg-gray-800 text-sm rounded-md shadow-md p-3"
          >
            <ProfileCard profile={user.profile} />
          </motion.div>
        )}
        <button
          onClick={toggle}
          className="cursor-pointer relative flex items-center justify-center p-1 bg-gray-800 rounded-full border border-indigo-500/30"
        >
          <UserCircle2 size={30} className="text-gray-200" />
        </button>
      </div>
    </div>
  );
}
