import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Social app',
  description: 'Social media app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <ToastContainer />
      </body>
    </html>
  );
}
