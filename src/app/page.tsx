// 'use client';
// import SignUp from '@/components/auth/SignUp';
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import LogIn from '@/components/auth/LogIn';
// import Loading from './loading';

// export default function Auth() {
//   const [authPage, setAuthPage] = useState<'signup' | 'login'>('signup');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLoading = (loading: boolean) => {
//     setIsLoading(loading);
//   };

//   return (
//     <div className="w-full flex items-center justify-center relative">
//       {isLoading && (
//         <div className="absolute top-0 left-0 h-full w-full z-10 bg-white">
//           <Loading />
//         </div>
//       )}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={authPage}
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -50 }}
//           transition={{ duration: 0.5, ease: 'easeInOut' }}
//           className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-8"
//         >
//           {authPage === 'signup' ? (
//             <SignUp setLoading={handleLoading} />
//           ) : (
//             <LogIn setLoading={handleLoading} />
//           )}
//         </motion.div>
//       </AnimatePresence>
//       <motion.button
//         onClick={() => setAuthPage(authPage === 'signup' ? 'login' : 'signup')}
//         whileHover={{ scale: 1.05, rotate: 2 }}
//         whileTap={{ scale: 0.95 }}
//         className="absolute hover:cursor-pointer bottom-8 right-8 bg-white/50 backdrop-blur-md hover:bg-white/70 text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
//       >
//         {authPage === 'signup' ? 'Switch to Log In' : 'Switch to Sign Up'}
//       </motion.button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LogIn from "@/components/auth/LogIn";
import SignUp from "@/components/auth/SignUp";
import Loading from "./loading";

export default function Auth() {
  const [authPage, setAuthPage] = useState<"signup" | "login">("signup");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 h-full w-full z-10 bg-white">
          <Loading />
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={authPage}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-2 flex flex-col w-full"
        >
          {authPage === "signup" ? <SignUp setLoading={handleLoading} /> : <LogIn setLoading={handleLoading} />}
          <motion.button
            onClick={() => setAuthPage(authPage === "signup" ? "login" : "signup")}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="hover:cursor-pointer mt-3 bottom-2 bg-white/50 backdrop-blur-md hover:bg-white/70 text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 w-full"
          >
            {authPage === "signup" ? "Switch to Log In" : "Switch to Sign Up"}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
