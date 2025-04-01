import { Loader2 } from 'lucide-react';

type Props = {
  size?: number;
  text?: string;
  color?: string;
  className?: string;
};

export default function LoaderPlaceholder({
  size,
  text,
  color,
  className,
}: Props) {
  return (
    <>
      <Loader2
        size={size || 24}
        className={`animate-spin ${className} `}
        color={color || 'gray'}
      />
      {text && <p className="text-gray-500">{text}</p>}
    </>
  );
}
