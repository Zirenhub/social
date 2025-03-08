import { Loader2 } from 'lucide-react';

export default function LoaderPlaceholder() {
  return (
    <div className="flex items-center justify-center w-12 h-12">
      <Loader2 size={24} className="animate-spin text-gray-400" />
    </div>
  );
}
