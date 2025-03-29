import { Settings, Share2 } from 'lucide-react';
import Link from 'next/link';

type Props = {
  isCurrentUser: boolean;
};

export default function ProfileHeader({ isCurrentUser }: Props) {
  return (
    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue-500)] via-[var(--color-purple-500)] to-[var(--color-cyan-500)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="absolute top-4 right-4 z-10 flex gap-3">
        <Link
          href="/profile/share"
          className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-105"
          aria-label="Share profile"
        >
          <Share2 size={18} className="text-white" />
        </Link>
        {isCurrentUser && (
          <Link
            href="/settings"
            className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Settings"
          >
            <Settings size={18} className="text-white" />
          </Link>
        )}
      </div>
    </div>
  );
}
