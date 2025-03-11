'use client';
import { useCreatePost } from '@/hooks/useCreatePost';
import { MAX_POST_CHARS } from '@/types/post';
import LoaderPlaceholder from '../loader/LoaderPlaceholder';
import { ArrowRight } from 'lucide-react';

export default function CreatePost() {
  const { submit, formErrors, register, isSubmitting, charCount } =
    useCreatePost();

  // Calculate percentage for progress bar
  const percentUsed = Math.min((charCount / MAX_POST_CHARS) * 100, 100);
  const isOverLimit = charCount > MAX_POST_CHARS;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="relative group">
        <textarea
          {...register('content')}
          placeholder="Tell us what's on your mind."
          className="w-full p-5 h-40 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-[var(--color-cyan-500)] focus:ring-opacity-30 focus:border-[var(--color-cyan-500)] outline-none transition-all duration-300 resize-none"
        />

        {/* Character count indicator with progress bar */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end space-y-1">
          <div
            className={`text-sm font-medium ${isOverLimit ? 'text-[var(--color-magenta-500)]' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {charCount}/{MAX_POST_CHARS}
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

      <div className="flex items-center justify-between">
        {formErrors?.content && (
          <p className="text-[var(--color-magenta-500)] text-sm">
            {formErrors.content.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isOverLimit}
          className="ml-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--color-cyan-500)] to-[var(--color-blue-500)] text-white font-medium shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md flex items-center gap-2 group cursor-pointer"
        >
          {isSubmitting ? (
            <LoaderPlaceholder text="Posting..." />
          ) : (
            <>
              <span>Post</span>
              <ArrowRight />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
