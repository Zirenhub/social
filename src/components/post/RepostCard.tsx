import React from "react";

import { RepostOfType } from "@/types/post";
import PostHeader from "./PostHeader";

type Props = { repost: RepostOfType; onClick(e: React.MouseEvent<HTMLDivElement>, repost?: boolean): void };

function RepostCard({ repost, onClick }: Props) {
  return (
    <div
      onClick={(e) => {
        onClick(e, true);
      }}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      className="pointer-events-auto mx-3 my-2 rounded-lg p-2 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-50 cursor-pointer md:rounded-xl md:shadow-sm"
    >
      <div className="flex justify-between items-start">
        <PostHeader profile={{ ...repost.profile, id: repost.profileId }} post={{ createdAt: repost.createdAt }} />
      </div>
      <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg">{repost.content}</p>
    </div>
  );
}

export default React.memo(RepostCard);
