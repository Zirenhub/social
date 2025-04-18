import type { Metadata } from "next";
import dynamic from "next/dynamic";

import Feed from "@/components/post/Feed";
import { HomeHeader } from "@/components/ui/mobile/headers";
import { HeaderSlot } from "@/components/ui/mobile/MobileHeader";
import { HOME_PAGE_POSTS_FILTERS, homeFilters } from "@/types/constants";

const Filter = dynamic(() => import("../../../../components/ui/Filter"), {
  loading: () => <p>Loading...</p>,
});
const CreatePost = dynamic(() => import("../../../../components/ui/CreatePost"));

export const metadata: Metadata = {
  title: "Home Feed",
  description: "View your personalized feed",
};

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { filter } = await searchParams;

  const currentFilter = HOME_PAGE_POSTS_FILTERS.find((x) => x === filter) || "forYou";

  return (
    <>
      <HeaderSlot content={<HomeHeader currentFilter={currentFilter} filters={homeFilters} />} />
      <div className="hidden not-last-of-type:max-h-74 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 mb-4 h-80 md:flex flex-col gap-4">
        <h1 className="container-title text-2xl tracking-tight ">Share your thoughts!</h1>
        <CreatePost />
      </div>
      <Filter currentFilter={currentFilter} filters={homeFilters} className="hidden md:flex" />
      <div className="hidden md:block md:my-4" />
      <Feed endpoint="/api/posts" showCreatePost={currentFilter === "forYou"} filter={currentFilter} />
    </>
  );
}
