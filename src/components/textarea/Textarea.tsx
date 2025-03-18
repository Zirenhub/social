import { UseFormRegister } from 'react-hook-form';

type Props = {
  register: UseFormRegister<any>;
  name: string; // The field name for register
  maxChars: number;
  placeholder?: string;
  charCount: number;
  className?: string;
};

export default function Textarea({
  register,
  name,
  maxChars,
  placeholder,
  charCount,
  className,
}: Props) {
  const percentUsed = Math.min((charCount / maxChars) * 100, 100);
  const isOverLimit = charCount > maxChars;

  return (
    <div className="relative group">
      <textarea
        {...register(name)}
        placeholder={placeholder ? placeholder : "Tell us what's on your mind."}
        className="w-full p-5 h-40 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-[var(--color-cyan-500)] focus:ring-opacity-30 focus:border-[var(--color-cyan-500)] outline-none transition-all duration-300 resize-none"
      />

      {/* Character count indicator with progress bar */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end space-y-1">
        <div
          className={`text-sm font-medium ${isOverLimit ? 'text-[var(--color-magenta-500)]' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {charCount}/{maxChars}
        </div>

        {/* Progress bar */}
        <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-[var(--color-magenta-500)]' : 'bg-[var(--color-cyan-500)]'}`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Animated focus decorative element */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-cyan-500)] via-[var(--color-blue-500)] to-[var(--color-purple-500)] rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
    </div>
  );
}
