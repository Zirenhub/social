import Navigation from '@/components/nav-bar/Navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-black">
      <Navigation />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
