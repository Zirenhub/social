"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut as LogOutIcon } from "lucide-react";

import { logOut as logOutAction } from "@/app/api/auth/actions";
import LoaderPlaceholder from "../ui/LoaderPlaceholder";

export default function LogOut() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogOut() {
    startTransition(async () => {
      await logOutAction();
      router.replace("/");
    });
  }

  if (isPending) {
    return <LoaderPlaceholder />;
  }

  return (
    <motion.button
      onClick={handleLogOut}
      whileHover={{ scale: 1.05, rotate: 3 }}
      whileTap={{ scale: 0.98 }}
      className="h-8 w-8 flex items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-indigo-500 to-teal-400 hover:from-indigo-400 hover:to-teal-300 transition-all duration-300 ease-in-out shadow-lg hover:shadow-teal-300/30 backdrop-blur-md group"
    >
      <LogOutIcon
        size={16}
        className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] group-hover:animate-pulse"
      />
    </motion.button>
  );
}
