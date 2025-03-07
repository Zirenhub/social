'use client';
import SignUp from '@/components/auth/SignUp';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogIn from '@/components/auth/LogIn';
import Loading from './loading';

export default function Auth() {
  const [authPage, setAuthPage] = useState<'signup' | 'login'>('signup');
  const [isPending, setIsPending] = useState<boolean>(false);

  function setPending(pending: boolean) {
    setIsPending(pending);
  }

  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-50"
      >
        <Loading />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={authPage}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-8"
        >
          {authPage === 'signup' ? (
            <SignUp setPending={setPending} />
          ) : (
            <LogIn setPending={setPending} />
          )}
        </motion.div>
      </AnimatePresence>
      <motion.button
        onClick={() => setAuthPage(authPage === 'signup' ? 'login' : 'signup')}
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute hover:cursor-pointer bottom-8 right-8 bg-white/50 backdrop-blur-md hover:bg-white/70 text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
      >
        {authPage === 'signup' ? 'Switch to Log In' : 'Switch to Sign Up'}
      </motion.button>
    </div>
  );
}
