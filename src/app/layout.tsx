import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import Providers from './providers';
import getSession from '@/lib/getSession';
import './globals.css';

export const metadata: Metadata = {
  title: 'Social app',
  description: 'Social media app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={auth}>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
