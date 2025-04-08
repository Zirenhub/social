type Props = {
  className?: string;
};

export default function OnlineIndicator({ className }: Props) {
  return (
    <span
      className={`absolute -bottom-1 -right-1 w-4 h-4 bg-lime-500 rounded-full border-2 border-white dark:border-dark-500 ${className ? className : ''}`}
    ></span>
  );
}
