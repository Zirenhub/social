'use client';
import { useCreatePost } from '@/hooks/useCreatePost';
import { MAX_POST_CHARS } from '@/types/post';
import LoaderPlaceholder from '../loader/LoaderPlaceholder';
import { ArrowRight } from 'lucide-react';
import Textarea from '../textarea/Textarea';

export default function CreatePost() {
  const { submit, formErrors, register, isSubmitting, charCount } =
    useCreatePost();

  // Calculate percentage for progress bar
  const percentUsed = Math.min((charCount / MAX_POST_CHARS) * 100, 100);
  const isOverLimit = charCount > MAX_POST_CHARS;

  return (
    <form onSubmit={submit} className="space-y-4">
      <Textarea
        register={register}
        name={'content'}
        maxChars={MAX_POST_CHARS}
        charCount={charCount}
      />

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
