import { useUser } from '@/context/UserContext';
import { UserCircle2 } from 'lucide-react';

export default function ProfileOverview() {
  const user = useUser();

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-indigo-500/10 cursor-pointer">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full blur-sm opacity-70"></div>
        <div className="relative flex items-center justify-center p-1 bg-gray-900 rounded-full border border-indigo-500/30">
          <UserCircle2 size={30} className="text-gray-200" />
        </div>
      </div>
    </div>
  );
}
