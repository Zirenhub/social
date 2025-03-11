import { Loader2 } from 'lucide-react';

type Props = { size?: number; text?: string };

export default function LoaderPlaceholder({ size, text }: Props) {
  return (
    <>
      <Loader2 size={size || 24} className="animate-spin" color="gray" />
      {text && <p className="text-gray-500">{text}</p>}
    </>
  );
}
