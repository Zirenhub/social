import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full justify-center items-center white:bg-white dark:bg-black">
      <Loader2 className="animate-spin h-16 w-16 text-blue-500" />
    </div>
  );
}
