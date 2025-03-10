import { Loader2 } from 'lucide-react';

type Props = { text?: string };

export default function LoaderPlaceholder({ text }: Props) {
  return (
    <>
      <Loader2 size={24} className="animate-spin text-gray-400" />
      {text && <p>{text}</p>}
    </>
  );
}
