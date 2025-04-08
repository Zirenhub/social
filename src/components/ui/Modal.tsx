'use client';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

type Props = {
  title?: string;
  close: () => void;
  children: React.ReactNode;
  isOpen: boolean;
  profile?: { firstName: string; lastName: string; avatarUrl: string | null };
};

export default function Modal({
  title,
  close,
  children,
  isOpen,
  profile,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[var(--color-dark-500)]/40 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="relative w-full max-w-lg overflow-hidden bg-white/90 dark:bg-[var(--color-dark-500)]/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-cyan-500)] via-[var(--color-purple-500)] to-[var(--color-magenta-500)]" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {profile && <Avatar profile={profile} />}
                  {title && (
                    <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-dark-500)]/80 dark:text-white">
                      {title}
                    </h3>
                  )}
                </div>
                <button
                  onClick={close}
                  className="cursor-pointer flex items-center justify-center w-8 h-8 ml-auto transition-all rounded-full text-[var(--color-dark-500)]/60 dark:text-white/60 hover:bg-[var(--color-magenta-500)]/10 hover:text-[var(--color-magenta-500)]"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-[var(--color-dark-500)]/80 dark:text-white/80">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
