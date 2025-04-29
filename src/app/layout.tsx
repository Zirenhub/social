import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import { auth } from "@/auth";
import Providers from "./providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social app",
  description: "Social media app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <Providers session={session}>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
