import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import { auth } from "@/auth";
import Providers from "./providers";

import "./globals.css";

import { headers } from "next/headers";

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
    <html lang="en" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
