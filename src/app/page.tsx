"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import LogIn from "@/components/auth/LogIn";
import SignUp from "@/components/auth/SignUp";
import Loading from "./loading";

export default function Auth() {
  const [authPage, setAuthPage] = useState<"signup" | "login">("signup");
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme, theme } = useTheme();

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  useEffect(() => {
    const initialTheme = theme;
    // using theme from useTheme will change after updating theme here so store it in a variable
    setTheme("light");

    return () => {
      if (initialTheme) setTheme(initialTheme);
    };
  }, []);

  return (
    <div className="flex w-full min-h-full sm:justify-center">
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
          className="bg-white/50 p-2 flex flex-col w-full sm:w-[400px]"
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
    </div>
  );
}
