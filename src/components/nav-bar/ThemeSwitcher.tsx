"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import LoaderPlaceholder from "../ui/LoaderPlaceholder";

export default function ThemeSwitcher() {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <LoaderPlaceholder />;

  const isDark = resolvedTheme === "dark";

  const SwitcherButton = ({
    icon,
    onClick,
    className,
  }: {
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
  }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.15, rotate: 8 }}
      whileTap={{ scale: 0.92 }}
      className={`group p-2 rounded-full border transition-all duration-500 backdrop-blur-md shadow-md
        ${isDark ? "border-white/20 bg-gradient-to-br from-white/10 to-white/5" : "border-black/10 bg-gradient-to-br from-black/5 to-white/10"}
        ${className ?? ""}
      `}
    >
      {icon}
    </motion.button>
  );

  const iconVariants = {
    initial: { opacity: 0, rotate: -90, scale: 0.6 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0.6 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isDark ? (
        <motion.div key="sun" variants={iconVariants} initial="initial" animate="animate" exit="exit">
          <SwitcherButton
            onClick={() => setTheme("light")}
            icon={
              <Lightbulb
                size={16}
                className="text-yellow-300 group-hover:text-yellow-200 drop-shadow-[0_0_6px_rgba(253,224,71,0.6)] group-hover:animate-pulse"
              />
            }
          />
        </motion.div>
      ) : (
        <motion.div key="moon" variants={iconVariants} initial="initial" animate="animate" exit="exit">
          <SwitcherButton
            onClick={() => setTheme("dark")}
            icon={
              <Moon
                size={16}
                className="text-indigo-600 group-hover:text-purple-700 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)] group-hover:animate-pulse"
              />
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
