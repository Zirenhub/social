"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { IsMobileProvider } from "@/context/MobileProvider";
import { ModalProvider } from "@/context/ModalProvider";

type ProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};

export default function Providers({ children, session }: ProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <IsMobileProvider>
            <ModalProvider>{children}</ModalProvider>
          </IsMobileProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
