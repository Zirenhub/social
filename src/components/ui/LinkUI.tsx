"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  href: string;
  isActive: boolean;
  hash?: string;
  className?: string;
  children: ReactNode;
  tooltip?: { label: string; className?: string };
};

export const tooltipVariants = {
  hiddenTop: {
    opacity: 0,
    y: -2,
    scale: 0.97,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  hiddenBottom: {
    opacity: 0,
    y: 2,
    scale: 0.97,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
  visibleTop: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  visibleBottom: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

export default function LinkUI({ href, isActive, hash, className, children, tooltip }: Props) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [showBelow, setShowBelow] = useState<boolean>(false);
  const linkRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleHashChange = (e: { preventDefault: () => void }) => {
    if (isActive) {
      e.preventDefault();
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    if (hovered && linkRef.current) {
      const linkRect = linkRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight || 40; // Estimate if not yet rendered
      const topSpace = linkRect.top;

      setShowBelow(topSpace < tooltipHeight + 10);
    }
  }, [hovered]);

  return (
    <div
      ref={linkRef}
      className="relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className={` ${className ? className : ""}`}
        onNavigate={handleHashChange}
        prefetch={false}
        scroll={false}
      >
        {children}
      </Link>

      {tooltip && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              ref={tooltipRef}
              key="tooltip"
              variants={tooltipVariants}
              initial={showBelow ? "hiddenBottom" : "hiddenTop"}
              animate={showBelow ? "visibleBottom" : "visibleTop"}
              exit={showBelow ? "hiddenBottom" : "hiddenTop"}
              className={`absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none
                          ${showBelow ? "top-[120%]" : "-top-2/3"}
                          bg-white/5 dark:bg-[var(--color-dark-500)]/20
                          text-[var(--color-cyan-500)] dark:text-[var(--color-cyan-500)]
                          py-1 px-2 rounded text-xs
                          ring-1 ring-[var(--color-cyan-500)]/40
                          backdrop-blur ${tooltip.className ?? ""}`}
            >
              {tooltip.label}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
