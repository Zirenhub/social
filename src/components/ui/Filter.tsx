"use client";

import clsx from "clsx";
import { GridIcon, HeartIcon, Repeat2Icon } from "lucide-react";

import getFilterUrl from "@/helpers/getFilterUrl";
import { Filters } from "@/types/constants";
import LinkUI from "./LinkUI";

const iconMap = { posts: GridIcon, liked: HeartIcon, reposts: Repeat2Icon };

type Props = { currentFilter: string; filters: Filters<string>[]; className?: string };

export default function Filter({ currentFilter, filters, className }: Props) {
  const filterHash = filters.map((filter) => filter.url).toString();

  return (
    <>
      <div id={filterHash} />
      <div
        className={clsx(
          "sticky top-0 z-20 flex bg-white dark:bg-gray-800 sm:rounded-t-xl sm:shadow-sm sm:border border-gray-200 dark:border-gray-700",
          className && className
        )}
      >
        {filters.map((filter) => {
          const Icon = iconMap[filter.url as keyof typeof iconMap] || null;
          const isActive = currentFilter === filter.url;
          const tooltip = filter.tooltip;
          const isActiveClass = isActive
            ? "text-[var(--color-cyan-500)] border-b-2 border-[var(--color-cyan-500)]"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300";

          return (
            <LinkUI
              key={filter.label}
              isActive={isActive}
              hash={filterHash}
              href={getFilterUrl(filter.url)}
              className={`flex items-center py-3 px-2 justify-center font-medium text-center ${isActiveClass}`}
              {...(tooltip
                ? { tooltip: { label: tooltip, className: `${isActive ? "text-[var(--color-cyan-500)]" : ""}` } }
                : undefined)}
            >
              {Icon && <Icon className="m-1" size={18} />}
              <span>{filter.label}</span>
            </LinkUI>
          );
        })}
      </div>
    </>
  );
}
