import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import Providers from './providers';

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
    <html lang="en" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
