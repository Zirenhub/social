import clsx from "clsx";
import { Loader2 } from "lucide-react";

type Props = {
  size?: number;
  text?: string;
  color?: string;
  className?: string;
};

export default function LoaderPlaceholder({ size = 24, text, color = "gray", className }: Props) {
  return (
    <div className={clsx("flex items-center", !text && "justify-center", className)}>
      <Loader2 size={size} className="animate-spin" color={color} />
      {text && <p className="ml-2 text-gray-500">{text}</p>}
    </div>
  );
}
