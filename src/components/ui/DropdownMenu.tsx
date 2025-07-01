"use client";

import React, { useEffect, useRef, useState } from "react";

type DropdownMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
};

export function DropdownMenu({ trigger, children, align = "right" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        type="button"
        className="cursor-pointer"
        aria-label="Menu options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} z-10 mt-1 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-[var(--color-dark-500)] border border-[var(--color-dark-500)]/10 dark:border-white/10 min-w-40`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`cursor-pointer whitespace-nowrap flex items-center w-full px-4 py-2 text-sm text-left transition-colors text-[var(--color-dark-500)]/80 dark:text-white/80 hover:bg-[var(--color-magenta-500)]/10 hover:text-[var(--color-magenta-500)] ${className ? className : ""}`}
    >
      {children}
    </button>
  );
}
