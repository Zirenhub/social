"use client";

import { useEffect, useState } from "react";

import { useIsMobile } from "@/context/MobileProvider";
import { GetProfileType } from "@/types/profile";
import MobileHeader from "./mobile/MobileHeader";

type ResponsiveProps = {
  profile: GetProfileType;
  children: React.ReactNode;
};

export default function Responsive({ children, profile }: ResponsiveProps) {
  const isMobile = useIsMobile();
  const [navHeight, setNavHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!isMobile) return;
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      const navigation = document.getElementById("navigation");
      if (navigation) {
        setNavHeight(navigation.clientHeight);
      }
    }

    return () => {
      setNavHeight(null);
    };
  }, [isMobile]);

  // we can pass ref to header instead of using id.
  return (
    <>
      {isMobile && <MobileHeader profile={profile} />}
      {children}
      {isMobile && navHeight && <div className="block" style={{ height: navHeight }} />}
    </>
  );
}
